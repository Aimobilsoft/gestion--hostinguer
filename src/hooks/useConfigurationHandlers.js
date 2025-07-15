import { useState } from 'react';

export const useConfigurationHandlers = ({
  addBranch,
  updateBranch,
  deleteBranch,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  addDianResolution,
  updateDianResolution,
  deleteDianResolution,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  toast,
  setConfirmation
}) => {
  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [isWarehouseFormOpen, setIsWarehouseFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [isResolutionFormOpen, setIsResolutionFormOpen] = useState(false);
  const [editingResolution, setEditingResolution] = useState(null);
  const [isPaymentMethodFormOpen, setIsPaymentMethodFormOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);

  const handleOpenBranchForm = (branch = null) => { 
    setEditingBranch(branch); 
    setIsBranchFormOpen(true); 
  };

  const handleSaveBranch = (branchData) => {
    if (editingBranch) { 
      updateBranch(editingBranch.id, branchData); 
      toast({ title: 'Sede Actualizada' }); 
    } else { 
      addBranch(branchData); 
      toast({ title: 'Sede Creada' }); 
    }
    setIsBranchFormOpen(false); 
    setEditingBranch(null);
  };

  const handleDeleteBranch = (branchId) => {
    setConfirmation({ 
      isOpen: true, 
      title: 'Eliminar Sede', 
      description: '¿Estás seguro? Se eliminarán las bodegas asociadas.', 
      onConfirm: () => {
        deleteBranch(branchId); 
        toast({ title: 'Sede Eliminada' }); 
        setConfirmation({ isOpen: false });
      }
    });
  };

  const handleOpenWarehouseForm = (warehouse = null) => { 
    setEditingWarehouse(warehouse); 
    setIsWarehouseFormOpen(true); 
  };

  const handleSaveWarehouse = (warehouseData) => {
    if (editingWarehouse) { 
      updateWarehouse(editingWarehouse.id, warehouseData); 
      toast({ title: 'Bodega Actualizada' }); 
    } else { 
      addWarehouse(warehouseData); 
      toast({ title: 'Bodega Creada' }); 
    }
    setIsWarehouseFormOpen(false); 
    setEditingWarehouse(null);
  };

  const handleDeleteWarehouse = (warehouseId) => {
    setConfirmation({ 
      isOpen: true, 
      title: 'Eliminar Bodega', 
      description: '¿Estás seguro?', 
      onConfirm: () => {
        deleteWarehouse(warehouseId); 
        toast({ title: 'Bodega Eliminada' }); 
        setConfirmation({ isOpen: false });
      }
    });
  };

  const handleOpenResolutionForm = (resolution = null) => { 
    setEditingResolution(resolution); 
    setIsResolutionFormOpen(true); 
  };

  const handleSaveResolution = (resolutionData) => {
    if (editingResolution) { 
      updateDianResolution(editingResolution.id, resolutionData); 
      toast({ title: 'Resolución Actualizada' }); 
    } else { 
      addDianResolution(resolutionData); 
      toast({ title: 'Resolución Creada' }); 
    }
    setIsResolutionFormOpen(false); 
    setEditingResolution(null);
  };

  const handleDeleteResolution = (resolutionId) => {
    setConfirmation({ 
      isOpen: true, 
      title: 'Eliminar Resolución', 
      description: '¿Estás seguro?', 
      onConfirm: () => {
        deleteDianResolution(resolutionId); 
        toast({ title: 'Resolución Eliminada' }); 
        setConfirmation({ isOpen: false });
      }
    });
  };

  const handleOpenPaymentMethodForm = (paymentMethod = null) => { 
    setEditingPaymentMethod(paymentMethod); 
    setIsPaymentMethodFormOpen(true); 
  };

  const handleSavePaymentMethod = (paymentMethodData) => {
    if (editingPaymentMethod) { 
      updatePaymentMethod(editingPaymentMethod.id, paymentMethodData); 
      toast({ title: 'Forma de Pago Actualizada' }); 
    } else { 
      addPaymentMethod(paymentMethodData); 
      toast({ title: 'Forma de Pago Creada' }); 
    }
    setIsPaymentMethodFormOpen(false); 
    setEditingPaymentMethod(null);
  };

  const handleDeletePaymentMethod = (paymentMethodId) => {
    setConfirmation({ 
      isOpen: true, 
      title: 'Eliminar Forma de Pago', 
      description: '¿Estás seguro?', 
      onConfirm: () => {
        deletePaymentMethod(paymentMethodId); 
        toast({ title: 'Forma de Pago Eliminada' }); 
        setConfirmation({ isOpen: false });
      }
    });
  };

  return {
    isBranchFormOpen,
    setIsBranchFormOpen,
    editingBranch,
    isWarehouseFormOpen,
    setIsWarehouseFormOpen,
    editingWarehouse,
    isResolutionFormOpen,
    setIsResolutionFormOpen,
    editingResolution,
    isPaymentMethodFormOpen,
    setIsPaymentMethodFormOpen,
    editingPaymentMethod,
    handleOpenBranchForm,
    handleSaveBranch,
    handleDeleteBranch,
    handleOpenWarehouseForm,
    handleSaveWarehouse,
    handleDeleteWarehouse,
    handleOpenResolutionForm,
    handleSaveResolution,
    handleDeleteResolution,
    handleOpenPaymentMethodForm,
    handleSavePaymentMethod,
    handleDeletePaymentMethod
  };
};