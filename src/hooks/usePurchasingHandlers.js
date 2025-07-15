import { useState } from 'react';

export const usePurchasingHandlers = ({
  addSupplier,
  updateSupplier,
  toggleSupplierStatus,
  addPurchaseOrder,
  updatePurchaseOrder,
  approvePurchaseOrder,
  addWarehouseEntry,
  toast,
  setConfirmation
}) => {
  const [isPurchaseOrderFormOpen, setIsPurchaseOrderFormOpen] = useState(false);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
  const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isWarehouseEntryFormOpen, setIsWarehouseEntryFormOpen] = useState(false);
  const [editingWarehouseEntry, setEditingWarehouseEntry] = useState(null);

  const handleOpenPurchaseOrderForm = (order = null) => { 
    setEditingPurchaseOrder(order); 
    setIsPurchaseOrderFormOpen(true); 
  };

  const handleSavePurchaseOrder = (orderData) => {
    try {
      if (editingPurchaseOrder) { 
        updatePurchaseOrder(editingPurchaseOrder.id, orderData); 
        toast({ title: 'Orden de Compra Actualizada' }); 
      } else { 
        const newOrder = addPurchaseOrder(orderData); 
        toast({ title: 'Orden de Compra Creada', description: `Orden ${newOrder.id} creada exitosamente` }); 
      }
      setIsPurchaseOrderFormOpen(false); 
      setEditingPurchaseOrder(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleApprovePurchaseOrder = (order) => {
    approvePurchaseOrder(order.id, 'gerencia');
    toast({ title: 'Orden Aprobada', description: `La orden ${order.id} ha sido aprobada` });
  };

  const handleOpenSupplierForm = (supplier = null) => { 
    setEditingSupplier(supplier); 
    setIsSupplierFormOpen(true); 
  };

  const handleSaveSupplier = (supplierData) => {
    if (editingSupplier) { 
      updateSupplier(editingSupplier.id, supplierData); 
      toast({ title: 'Proveedor Actualizado' }); 
    } else { 
      addSupplier(supplierData); 
      toast({ title: 'Proveedor Creado' }); 
    }
    setIsSupplierFormOpen(false); 
    setEditingSupplier(null);
  };

  const handleToggleSupplierStatus = (supplierId) => {
    const supplier = toggleSupplierStatus(supplierId);
    const newStatus = supplier.isActive ? 'activado' : 'desactivado';
    const title = `Proveedor ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
    toast({ title: title, description: `El proveedor "${supplier.name}" ha sido ${newStatus}.` });
  };

  const handleOpenWarehouseEntryForm = (entry = null) => { 
    setEditingWarehouseEntry(entry); 
    setIsWarehouseEntryFormOpen(true); 
  };

  const handleSaveWarehouseEntry = (entryData) => {
    try {
      const newEntry = addWarehouseEntry(entryData);
      toast({ title: 'Entrada de Almacén Registrada', description: `Entrada ${newEntry.id} registrada exitosamente` });
      setIsWarehouseEntryFormOpen(false);
      setEditingWarehouseEntry(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return {
    isPurchaseOrderFormOpen,
    setIsPurchaseOrderFormOpen,
    editingPurchaseOrder,
    isSupplierFormOpen,
    setIsSupplierFormOpen,
    editingSupplier,
    isWarehouseEntryFormOpen,
    setIsWarehouseEntryFormOpen,
    editingWarehouseEntry,
    handleOpenPurchaseOrderForm,
    handleSavePurchaseOrder,
    handleApprovePurchaseOrder,
    handleOpenSupplierForm,
    handleSaveSupplier,
    handleToggleSupplierStatus,
    handleOpenWarehouseEntryForm,
    handleSaveWarehouseEntry
  };
};