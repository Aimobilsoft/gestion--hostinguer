import { useState, useCallback } from 'react';

const initialBranches = [
  { id: 'SEDE-001', code: 'PR', name: 'Sede Principal', address: 'Av. Colombia #1-10', city: 'Bogotá', phone: '601-555-0101', email: 'principal@mobilfood.co' },
  { id: 'SEDE-002', code: 'NOR', name: 'Sede Norte', address: 'Calle 127 #15-20', city: 'Bogotá', phone: '601-555-0102', email: 'norte@mobilfood.co' },
];

const initialWarehouses = [
  { id: 'BOD-001', code: 'P01', branchId: 'SEDE-001', name: 'Bodega Central', address: 'Misma de la sede', manager: 'John Doe', allowsNegativeStock: false },
  { id: 'BOD-002', code: 'N01', branchId: 'SEDE-002', name: 'Bodega Norte', address: 'Misma de la sede', manager: 'Jane Smith', allowsNegativeStock: true },
];

const initialPaymentMethods = [
  { id: 'PM-01', name: 'Efectivo', requiresCardNumber: false, requiresApproval: false, associatedAccount: '110505', comission: 0 },
  { id: 'PM-02', name: 'Tarjeta de Crédito', requiresCardNumber: true, requiresApproval: true, associatedAccount: '111005', comission: 2.5 },
  { id: 'PM-03', name: 'Transferencia Bancaria', requiresCardNumber: false, requiresApproval: false, associatedAccount: '111005', comission: 0 },
];

export const useConfigurationData = ({ deleteDianResolutionByOwner }) => {
  const [branches, setBranches] = useState(initialBranches);
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  
  const [currentBranch, setCurrentBranch] = useState(null);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);

  const addBranch = useCallback((branchData) => {
    const newBranch = { ...branchData, id: `SEDE-${String(branches.length + 1).padStart(3, '0')}` };
    setBranches(prev => [newBranch, ...prev]);
    return newBranch;
  }, [branches.length]);

  const updateBranch = useCallback((branchId, updatedData) => {
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, ...updatedData } : b));
  }, []);

  const deleteBranch = useCallback((branchId) => {
    setBranches(prev => prev.filter(b => b.id !== branchId));
    setWarehouses(prev => prev.filter(w => w.branchId !== branchId));
    if (deleteDianResolutionByOwner) {
      deleteDianResolutionByOwner('branchId', branchId);
    }
  }, [deleteDianResolutionByOwner]);

  const addWarehouse = useCallback((warehouseData) => {
    const newWarehouse = { ...warehouseData, id: `BOD-${String(warehouses.length + 1).padStart(3, '0')}` };
    setWarehouses(prev => [newWarehouse, ...prev]);
    return newWarehouse;
  }, [warehouses.length]);

  const updateWarehouse = useCallback((warehouseId, updatedData) => {
    setWarehouses(prev => prev.map(w => w.id === warehouseId ? { ...w, ...updatedData } : w));
  }, []);

  const deleteWarehouse = useCallback((warehouseId) => {
    setWarehouses(prev => prev.filter(w => w.id !== warehouseId));
    if (deleteDianResolutionByOwner) {
      deleteDianResolutionByOwner('warehouseId', warehouseId);
    }
  }, [deleteDianResolutionByOwner]);

  const addPaymentMethod = useCallback((methodData) => {
    const newMethod = { ...methodData, id: `PM-${String(paymentMethods.length + 1).padStart(2, '0')}`};
    setPaymentMethods(prev => [newMethod, ...prev]);
    return newMethod;
  }, [paymentMethods.length]);

  const updatePaymentMethod = useCallback((methodId, updatedData) => {
    setPaymentMethods(prev => prev.map(m => m.id === methodId ? { ...m, ...updatedData } : m));
  }, []);

  const deletePaymentMethod = useCallback((methodId) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
  }, []);
  
  return {
    branches, addBranch, updateBranch, deleteBranch,
    warehouses, addWarehouse, updateWarehouse, deleteWarehouse,
    paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
    currentBranch, setCurrentBranch,
    currentWarehouse, setCurrentWarehouse,
  };
};