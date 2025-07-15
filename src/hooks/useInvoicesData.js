import { useState } from 'react';
import { format, isToday } from 'date-fns';

const calculateTotals = (items) => {
    const subtotal = items.reduce((acc, item) => {
        const quantity = Number(item.quantity) || Number(item.returnQuantity) || 0;
        const price = Number(item.price) || 0;
        const discountPercent = Number(item.discount) || 0;
        const itemTotal = quantity * price;
        const discountAmount = itemTotal * (discountPercent / 100);
        return acc + (itemTotal - discountAmount);
    }, 0);
    
    const totalDiscount = items.reduce((acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const discountPercent = Number(item.discount) || 0;
        return acc + (quantity * price * (discountPercent / 100));
    }, 0);

    const totalTax = items.reduce((acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const tax = Number(item.tax) || 0;
        const discountPercent = Number(item.discount) || 0;
        const base = (quantity * price) * (1 - discountPercent / 100);
        return acc + (base * (tax / 100));
    }, 0);

    const total = subtotal + totalTax;

    return { subtotal, totalTax, totalDiscount, total };
};

const initialInvoices = [
  { 
    id: 'FAC-001', branchId: 'SEDE-001', warehouseId: 'BOD-001', resolutionId: 'RES-001',
    client: { id: 1, name: 'Empresa ABC S.A.S', nit: '900123456-7', email: 'facturacion@empresaabc.com', phone: '+57 1 234 5678', address: 'Calle 123 #45-67, Bogotá', assignedSalespersonId: 'V-01', advances: 0 }, 
    issueDate: '2025-06-26', dueDate: '2025-07-26', 
    items: [{ productId: '1', name: 'Consultoría Empresarial', unit: 'UND', quantity: 5, price: 500000, tax: 19, cost: 300000, discount: 0, requiresInventoryControl: true }], 
    returnedItems: {}, subtotal: 2500000, totalTax: 475000, totalDiscount: 0, total: 2975000, totalCost: 1500000,
    status: 'pagada', dianStatus: 'aprobada', cufe: 'cufecode-e8a7b5e1-2f8c-4a0d-8d2b-6e9f1a2b3c4d', 
    dianResponse: 'Factura validada por la DIAN.',
    paymentMethod: { id: 'PM-001', name: 'Efectivo', accountCode: '11050501', accountName: 'Caja General' },
    paymentReference: '', appliedAdvance: 0
  },
  { 
    id: 'FAC-002', branchId: 'SEDE-001', warehouseId: 'BOD-001', resolutionId: 'RES-001',
    client: { id: 2, name: 'Comercial XYZ Ltda', nit: '800987654-3', email: 'contabilidad@comercialxyz.com', phone: '3119876543', address: 'Carrera 78 #90-12, Medellín', assignedSalespersonId: 'V-02', advances: 50000 }, 
    issueDate: format(new Date(), 'yyyy-MM-dd'), dueDate: '2025-07-27', 
    items: [{ productId: '2', name: 'Software de Gestión', unit: 'LIC', quantity: 1, price: 1200000, tax: 19, cost: 800000, discount: 10, requiresInventoryControl: false }], 
    returnedItems: {}, subtotal: 1080000, totalTax: 205200, totalDiscount: 120000, total: 1285200, totalCost: 800000,
    status: 'pendiente', dianStatus: 'enviada', cufe: 'cufecode-a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6', 
    dianResponse: 'Enviado a la DIAN para validación.',
    paymentMethod: { id: 'PM-003', name: 'Crédito', accountCode: '13050101', accountName: 'Clientes' },
    paymentReference: '', appliedAdvance: 0
  },
];

export const useInvoicesData = ({ resolutionsHook, inventoryHook, accountingHook, productsData, clientsData }) => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [creditNotes, setCreditNotes] = useState([]);

  const updateDianStatus = (collectionSetter, docId, dianStatus, dianResponse) => {
    collectionSetter(prev => prev.map(doc => doc.id === docId ? { ...doc, dianStatus, dianResponse } : doc));
  };

  const addInvoice = (invoiceData) => {
    const { currentBranch, currentWarehouse, appliedAdvance } = invoiceData;
    const resolution = resolutionsHook.getCurrentResolution(currentBranch.id, currentWarehouse.id, 'invoice');
    
    if (!resolution) {
      throw new Error(`No hay una resolución de facturación activa para esta sede/bodega.`);
    }

    const resolutionStatus = resolutionsHook.checkResolutionLimits(resolution);

    if (!resolutionStatus.isOk) {
      throw new Error(`No se puede facturar: ${resolutionStatus.warnings.join(' ')}`);
    }

    const stockValidation = inventoryHook.validateStock(invoiceData.items, currentWarehouse.id, productsData.products);
    if (stockValidation.length > 0) {
      const errorMessage = stockValidation.map(e => `${e.productName}: Solicitado ${e.requested}, Disponible ${e.available}`).join('; ');
      throw new Error(`Stock insuficiente: ${errorMessage}`);
    }

    const invoiceId = resolutionsHook.getNextNumber(resolution.id);
    const enrichedItems = invoiceData.items.map(item => ({ ...item, cost: inventoryHook.getProductCost(item.productId, currentWarehouse.id) }));
    const totalCost = enrichedItems.reduce((acc, item) => acc + (item.quantity * item.cost), 0);
    const { subtotal, totalTax, totalDiscount, total } = calculateTotals(enrichedItems);

    const newInvoice = { 
      ...invoiceData, id: invoiceId, items: enrichedItems, totalCost, subtotal, totalTax, totalDiscount, total,
      returnedItems: {}, cufe: `cufecode-${crypto.randomUUID()}`, dianStatus: 'procesando', 
      dianResponse: 'Enviado a la DIAN para validación.', status: 'pendiente', appliedAdvance,
      branchId: currentBranch.id, warehouseId: currentWarehouse.id, resolutionId: resolution.id,
    };
    
    setInvoices((prev) => [newInvoice, ...prev]);
    resolutionsHook.updateResolutionNumber(resolution.id);
    
    enrichedItems.forEach(item => {
      inventoryHook.updateStock(item.productId, currentWarehouse.id, item.quantity, 'subtract', productsData.products);
    });

    if (appliedAdvance > 0) {
      clientsData.applyAdvance(newInvoice.client.id, appliedAdvance);
    }
    
    const itemsWithAccounting = enrichedItems.map(item => {
      const product = productsData.products.find(p => p.id === parseInt(item.productId, 10));
      return { ...item, accountingConfig: product?.accountingConfig || {} };
    });
    
    accountingHook.addAccountingEntry('FV', invoiceId, total, `Factura de Venta - ${newInvoice.client.name}`, currentBranch.id, currentWarehouse.id, newInvoice.paymentMethod, itemsWithAccounting);
    if (totalCost > 0) {
      accountingHook.addAccountingEntry('CV', invoiceId, totalCost, `Costo de Ventas - ${newInvoice.client.name}`, currentBranch.id, currentWarehouse.id, null, itemsWithAccounting);
    }
    
    setTimeout(() => {
      const isApproved = Math.random() > 0.2;
      updateDianStatus(setInvoices, newInvoice.id, isApproved ? 'aprobada' : 'rechazada', isApproved ? 'Factura validada por la DIAN.' : 'Factura rechazada.');
    }, 3000);
    
    return newInvoice;
  };
  
  const getReturnableItems = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return [];
    return invoice.items.map(item => ({...item, quantity: item.quantity - (invoice.returnedItems[item.productId] || 0)}));
  };

  const canVoidInvoice = (invoice) => {
    if (!invoice || !invoice.issueDate || invoice.status === 'anulada') return false;
    const invoiceDate = new Date(`${invoice.issueDate}T00:00:00`);
    return isToday(invoiceDate);
  };

  const addCreditNote = (originalInvoice, returnedItems, reason) => {
    const resolution = resolutionsHook.getCurrentResolution(originalInvoice.branchId, originalInvoice.warehouseId, 'credit_note');
    if (!resolution) throw new Error('No hay resolución DIAN vigente para notas de crédito');

    const { subtotal, totalTax, total } = calculateTotals(returnedItems);
    const itemsForNote = returnedItems.map(item => ({...item, quantity: item.returnQuantity}));
    const creditNoteId = resolutionsHook.getNextNumber(resolution.id);
    
    const entryType = reason === 'Anulación de factura' ? 'AF' : 'DC';
    
    const itemsWithAccounting = returnedItems.map(item => {
      const product = productsData.products.find(p => p.id === parseInt(item.productId, 10));
      return { ...item, accountingConfig: product?.accountingConfig || {} };
    });

    const accountingEntry = accountingHook.addAccountingEntry(
      entryType, 
      creditNoteId, 
      total, 
      `${reason} - ${originalInvoice.client.name}`, 
      originalInvoice.branchId, 
      originalInvoice.warehouseId, 
      null, 
      itemsWithAccounting, 
      originalInvoice.status === 'pagada'
    );

    const returnedCost = itemsWithAccounting.reduce((acc, item) => {
      if (item.requiresInventoryControl) {
        return acc + (item.returnQuantity * (item.cost || 0));
      }
      return acc;
    }, 0);

    if (returnedCost > 0) {
      accountingHook.addAccountingEntry(
        'RCV', 
        creditNoteId, 
        returnedCost, 
        `Reversión Costo - ${reason} - ${originalInvoice.client.name}`, 
        originalInvoice.branchId, 
        originalInvoice.warehouseId, 
        null, 
        itemsWithAccounting
      );
    }

    const newCreditNote = { 
      client: originalInvoice.client, branchId: originalInvoice.branchId, warehouseId: originalInvoice.warehouseId,
      resolutionId: resolution.id, items: itemsForNote, subtotal, totalTax, total, id: creditNoteId, 
      originalInvoiceId: originalInvoice.id, reason, issueDate: format(new Date(), 'yyyy-MM-dd'), 
      dueDate: format(new Date(), 'yyyy-MM-dd'), cufe: `cudecode-${crypto.randomUUID()}`, 
      dianStatus: 'procesando', dianResponse: 'Enviado a la DIAN para validación.', status: 'aprobada',
      accountingEntry: accountingEntry
    };
    
    setCreditNotes(prev => [newCreditNote, ...prev]);
    resolutionsHook.updateResolutionNumber(resolution.id);
    
    returnedItems.forEach(item => {
      inventoryHook.updateStock(item.productId, originalInvoice.warehouseId, item.returnQuantity, 'add', productsData.products);
    });
    
    setInvoices(prev => prev.map(inv => {
      if (inv.id === originalInvoice.id) {
        const newReturnedItems = { ...inv.returnedItems };
        returnedItems.forEach(item => { newReturnedItems[item.productId] = (newReturnedItems[item.productId] || 0) + item.returnQuantity; });
        const isVoiding = reason === 'Anulación de factura';
        const isFullyReturned = inv.items.every(item => (newReturnedItems[item.productId] || 0) >= item.quantity);
        const newStatus = isVoiding || isFullyReturned ? 'anulada' : 'parcialmente devuelta';
        return { ...inv, returnedItems: newReturnedItems, status: newStatus };
      }
      return inv;
    }));
    
    if (originalInvoice.status === 'pagada') {
        const clientToUpdate = clientsData.clients.find(c => c.id === originalInvoice.client.id);
        if (clientToUpdate) {
            clientsData.updateClient(clientToUpdate.id, { ...clientToUpdate, advances: (clientToUpdate.advances || 0) + total });
        }
    }
    
    setTimeout(() => { updateDianStatus(setCreditNotes, newCreditNote.id, 'aprobada', 'Nota de Crédito validada por la DIAN.'); }, 3000);
    return newCreditNote;
  };

  return {
    invoices, creditNotes, addInvoice, getReturnableItems, canVoidInvoice, addCreditNote
  };
};