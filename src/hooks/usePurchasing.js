import { useState } from 'react';
import { format } from 'date-fns';

const initialSuppliers = [
  {
    id: 'PROV-001',
    name: 'Distribuidora Nacional S.A.S',
    nit: '900123456-7',
    email: 'compras@distribuidoranacional.com',
    phone: '+57 1 234 5678',
    address: 'Calle 100 #15-20, Bogotá D.C.',
    contactPerson: 'María González',
    paymentTerms: 30,
    isActive: true,
    accountingConfig: {
      payableAccount: '2205',
      payableAccountName: 'Proveedores Nacionales',
      advanceAccount: '1355',
      advanceAccountName: 'Anticipos a Proveedores'
    }
  },
  {
    id: 'PROV-002',
    name: 'Tecnología y Servicios Ltda',
    nit: '800987654-3',
    email: 'facturacion@tecnoservicios.com',
    phone: '+57 2 345 6789',
    address: 'Carrera 50 #80-30, Medellín',
    contactPerson: 'Carlos Rodríguez',
    paymentTerms: 15,
    isActive: true,
    accountingConfig: {
      payableAccount: '2205',
      payableAccountName: 'Proveedores Nacionales',
      advanceAccount: '1355',
      advanceAccountName: 'Anticipos a Proveedores'
    }
  }
];

const initialPurchaseOrders = [
  {
    id: 'OC-001',
    supplierId: 'PROV-001',
    branchId: 'SEDE-001',
    warehouseId: 'BOD-001',
    orderDate: '2025-01-15',
    expectedDate: '2025-01-25',
    status: 'aprobada',
    items: [
      {
        productId: 1,
        name: 'Consultoría Empresarial',
        quantity: 10,
        unitCost: 280000,
        totalCost: 2800000,
        receivedQuantity: 0,
        pendingQuantity: 10
      }
    ],
    subtotal: 2800000,
    tax: 532000,
    total: 3332000,
    notes: 'Orden urgente para proyecto Q1',
    createdBy: 'admin',
    approvedBy: 'gerencia',
    approvedDate: '2025-01-15'
  }
];

const initialWarehouseEntries = [
  {
    id: 'EA-001',
    purchaseOrderId: 'OC-001',
    supplierId: 'PROV-001',
    branchId: 'SEDE-001',
    warehouseId: 'BOD-001',
    entryDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'pendiente',
    items: [
      {
        productId: 1,
        name: 'Consultoría Empresarial',
        orderedQuantity: 10,
        receivedQuantity: 8,
        unitCost: 280000,
        totalCost: 2240000,
        condition: 'bueno',
        notes: 'Recibido parcialmente'
      }
    ],
    subtotal: 2240000,
    tax: 425600,
    total: 2665600,
    receivedBy: 'almacenista',
    notes: 'Entrada parcial - pendiente 2 unidades'
  }
];

const initialSupplierInvoices = [
  {
    id: 'FP-001',
    supplierId: 'PROV-001',
    supplierInvoiceNumber: 'FACT-2025-001',
    purchaseOrderId: 'OC-001',
    warehouseEntryId: 'EA-001',
    branchId: 'SEDE-001',
    warehouseId: 'BOD-001',
    invoiceDate: '2025-01-16',
    dueDate: '2025-02-15',
    receivedDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'radicada',
    items: [
      {
        productId: 1,
        name: 'Consultoría Empresarial',
        quantity: 8,
        unitCost: 280000,
        totalCost: 2240000
      }
    ],
    subtotal: 2240000,
    tax: 425600,
    withholdings: {
      retefuente: 89600, // 4%
      reteica: 21.6, // 9.66/1000
      reteiva: 0
    },
    total: 2576000,
    paymentStatus: 'pendiente',
    accountingStatus: 'contabilizada',
    notes: 'Factura recibida y validada',
    radicatedBy: 'contabilidad'
  }
];

const initialSupportDocuments = [
  {
    id: 'DS-001',
    supplierId: 'PROV-002',
    branchId: 'SEDE-001',
    warehouseId: 'BOD-001',
    documentDate: format(new Date(), 'yyyy-MM-dd'),
    concept: 'Servicios de mantenimiento',
    amount: 150000,
    tax: 28500,
    withholdings: {
      retefuente: 6000,
      reteica: 1.45
    },
    total: 171498.55,
    status: 'aprobado',
    paymentStatus: 'pendiente',
    accountingStatus: 'contabilizado',
    notes: 'Mantenimiento preventivo equipos',
    createdBy: 'admin',
    approvedBy: 'jefe_compras'
  }
];

export const usePurchasing = () => {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [warehouseEntries, setWarehouseEntries] = useState(initialWarehouseEntries);
  const [supplierInvoices, setSupplierInvoices] = useState(initialSupplierInvoices);
  const [supportDocuments, setSupportDocuments] = useState(initialSupportDocuments);

  // Supplier management
  const addSupplier = (supplierData) => {
    const newSupplier = {
      ...supplierData,
      id: `PROV-${String(suppliers.length + 1).padStart(3, '0')}`,
      isActive: true
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    return newSupplier;
  };

  const updateSupplier = (supplierId, updatedData) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, ...updatedData } : supplier
    ));
  };

  const toggleSupplierStatus = (supplierId) => {
    let updatedSupplier = null;
    setSuppliers(prev => prev.map(supplier => {
      if (supplier.id === supplierId) {
        updatedSupplier = { ...supplier, isActive: !supplier.isActive };
        return updatedSupplier;
      }
      return supplier;
    }));
    return updatedSupplier;
  };

  // Purchase Order management
  const getNextPurchaseOrderId = () => {
    return `OC-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
  };

  const addPurchaseOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: getNextPurchaseOrderId(),
      status: 'borrador',
      createdBy: 'admin',
      items: orderData.items.map(item => ({
        ...item,
        receivedQuantity: 0,
        pendingQuantity: item.quantity
      }))
    };
    setPurchaseOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updatePurchaseOrder = (orderId, updatedData) => {
    setPurchaseOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updatedData } : order
    ));
  };

  const approvePurchaseOrder = (orderId, approvedBy) => {
    setPurchaseOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        status: 'aprobada',
        approvedBy,
        approvedDate: format(new Date(), 'yyyy-MM-dd')
      } : order
    ));
  };

  // Warehouse Entry management
  const getNextWarehouseEntryId = () => {
    return `EA-${String(warehouseEntries.length + 1).padStart(3, '0')}`;
  };

  const addWarehouseEntry = (entryData, updateInventoryFn) => {
    const newEntry = {
      ...entryData,
      id: getNextWarehouseEntryId(),
      status: 'completada',
      receivedBy: 'almacenista'
    };
    
    setWarehouseEntries(prev => [newEntry, ...prev]);
    
    // Update purchase order received quantities
    setPurchaseOrders(prev => prev.map(order => {
      if (order.id === entryData.purchaseOrderId) {
        const updatedItems = order.items.map(orderItem => {
          const entryItem = entryData.items.find(ei => ei.productId === orderItem.productId);
          if (entryItem) {
            const newReceivedQuantity = orderItem.receivedQuantity + entryItem.receivedQuantity;
            return {
              ...orderItem,
              receivedQuantity: newReceivedQuantity,
              pendingQuantity: orderItem.quantity - newReceivedQuantity
            };
          }
          return orderItem;
        });
        
        const allReceived = updatedItems.every(item => item.pendingQuantity === 0);
        const partiallyReceived = updatedItems.some(item => item.receivedQuantity > 0);
        
        return {
          ...order,
          items: updatedItems,
          status: allReceived ? 'completada' : partiallyReceived ? 'parcial' : 'aprobada'
        };
      }
      return order;
    }));
    
    // Update inventory
    entryData.items.forEach(item => {
      if (updateInventoryFn) {
        updateInventoryFn(item.productId, entryData.warehouseId, item.receivedQuantity, 'add');
      }
    });
    
    return newEntry;
  };

  // Supplier Invoice management
  const getNextSupplierInvoiceId = () => {
    return `FP-${String(supplierInvoices.length + 1).padStart(3, '0')}`;
  };

  const addSupplierInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: getNextSupplierInvoiceId(),
      receivedDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'radicada',
      paymentStatus: 'pendiente',
      accountingStatus: 'pendiente',
      radicatedBy: 'contabilidad'
    };
    setSupplierInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateSupplierInvoice = (invoiceId, updatedData) => {
    setSupplierInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, ...updatedData } : invoice
    ));
  };

  // Support Document management
  const getNextSupportDocumentId = () => {
    return `DS-${String(supportDocuments.length + 1).padStart(3, '0')}`;
  };

  const addSupportDocument = (documentData) => {
    const newDocument = {
      ...documentData,
      id: getNextSupportDocumentId(),
      status: 'aprobado',
      paymentStatus: 'pendiente',
      accountingStatus: 'pendiente',
      createdBy: 'admin'
    };
    setSupportDocuments(prev => [newDocument, ...prev]);
    return newDocument;
  };

  const updateSupportDocument = (documentId, updatedData) => {
    setSupportDocuments(prev => prev.map(document => 
      document.id === documentId ? { ...document, ...updatedData } : document
    ));
  };

  // Utility functions
  const getSupplierById = (supplierId) => {
    return suppliers.find(supplier => supplier.id === supplierId);
  };

  const getPurchaseOrderById = (orderId) => {
    return purchaseOrders.find(order => order.id === orderId);
  };

  const getApprovedPurchaseOrders = () => {
    return purchaseOrders.filter(order => order.status === 'aprobada' || order.status === 'parcial');
  };

  const getPendingReceiptOrders = () => {
    return purchaseOrders.filter(order => 
      (order.status === 'aprobada' || order.status === 'parcial') && 
      order.items.some(item => item.pendingQuantity > 0)
    );
  };

  return {
    // Data
    suppliers,
    purchaseOrders,
    warehouseEntries,
    supplierInvoices,
    supportDocuments,
    
    // Supplier functions
    addSupplier,
    updateSupplier,
    toggleSupplierStatus,
    getSupplierById,
    
    // Purchase Order functions
    addPurchaseOrder,
    updatePurchaseOrder,
    approvePurchaseOrder,
    getPurchaseOrderById,
    getApprovedPurchaseOrders,
    getPendingReceiptOrders,
    getNextPurchaseOrderId,
    
    // Warehouse Entry functions
    addWarehouseEntry,
    getNextWarehouseEntryId,
    
    // Supplier Invoice functions
    addSupplierInvoice,
    updateSupplierInvoice,
    getNextSupplierInvoiceId,
    
    // Support Document functions
    addSupportDocument,
    updateSupportDocument,
    getNextSupportDocumentId
  };
};