import { useState } from 'react';

const initialInventory = [
  { id: 'INV-001', productId: 1, warehouseId: 'BOD-001', quantity: 100, cost: 300000, minStock: 10, maxStock: 500, lastUpdated: '2025-01-15' },
  { id: 'INV-002', productId: 2, warehouseId: 'BOD-001', quantity: 50, cost: 800000, minStock: 5, maxStock: 100, lastUpdated: '2025-01-15' },
  { id: 'INV-003', productId: 3, warehouseId: 'BOD-001', quantity: 200, cost: 50000, minStock: 20, maxStock: 1000, lastUpdated: '2025-01-15' },
  { id: 'INV-004', productId: 4, warehouseId: 'BOD-001', quantity: 150, cost: 120000, minStock: 15, maxStock: 300, lastUpdated: '2025-01-15' },
  { id: 'INV-005', productId: 5, warehouseId: 'BOD-002', quantity: 80, cost: 450000, minStock: 10, maxStock: 200, lastUpdated: '2025-01-15' },
];

const initialMovements = [
    { id: 1, date: '2025-07-03', type: 'entrada', concept: 'ENTRADA DE ALMACEN', warehouseId: 'BOD-001', total: 990000, observation: 'ENTRADA POR ORDEN DE COMPRA', items: [{ productId: 1, quantity: 2, cost: 495000, total: 990000 }] },
    { id: 2, date: '2025-07-03', type: 'entrada', concept: 'ENTRADA DE ALMACEN', warehouseId: 'BOD-001', total: 4470000, observation: 'ENTRADA POR ORDEN DE COMPRA', items: [{ productId: 2, quantity: 5, cost: 894000, total: 4470000 }] },
    { id: 3, date: '2025-07-04', type: 'salida', concept: 'SALIDA POR AJUSTE', warehouseId: 'BOD-001', total: 300000, observation: 'Ajuste de inventario', items: [{ productId: 1, quantity: 1, cost: 300000, total: 300000 }] },
    { id: 4, date: '2025-07-04', type: 'traslado', concept: 'TRASLADO ENTRE BODEGAS', warehouseId: 'BOD-001', warehouseToId: 'BOD-002', total: 800000, observation: 'Movimiento a bodega secundaria', items: [{ productId: 2, quantity: 1, cost: 800000, total: 800000 }] },
];

export const useInventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [inventoryMovements, setInventoryMovements] = useState(initialMovements);

  const getNextMovementId = () => {
    return inventoryMovements.length > 0 ? Math.max(...inventoryMovements.map(m => m.id)) + 1 : 1;
  };

  const getProductStock = (productId, warehouseId) => {
    const inventoryItem = inventory.find(
      item => item.productId === parseInt(productId) && item.warehouseId === warehouseId
    );
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  const getProductCost = (productId, warehouseId) => {
    const inventoryItem = inventory.find(
      item => item.productId === parseInt(productId) && item.warehouseId === warehouseId
    );
    return inventoryItem ? inventoryItem.cost : 0;
  };

  const validateStock = (items, warehouseId, products = []) => {
    const validationErrors = [];
    
    items.forEach(item => {
      const product = products.find(p => p.id === parseInt(item.productId));
      
      if (!product || !product.requiresInventoryControl) {
        return;
      }
      
      const availableStock = getProductStock(item.productId, warehouseId);
      const requestedQuantity = parseInt(item.quantity) || 0;
      
      if (requestedQuantity > availableStock) {
        validationErrors.push({
          productId: item.productId,
          productName: item.name,
          requested: requestedQuantity,
          available: availableStock,
          shortage: requestedQuantity - availableStock
        });
      }
    });
    
    return validationErrors;
  };

  const updateStock = (productId, warehouseId, quantityChange, newCost, operation = 'subtract', products = []) => {
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product || !product.requiresInventoryControl) {
      return;
    }

    setInventory(prev => {
      const itemIndex = prev.findIndex(item => item.productId === parseInt(productId) && item.warehouseId === warehouseId);
      
      if (itemIndex > -1) {
        const updatedInventory = [...prev];
        const currentItem = updatedInventory[itemIndex];
        
        const currentTotalValue = currentItem.quantity * currentItem.cost;
        const changeTotalValue = quantityChange * newCost;

        let newQuantity, newAverageCost;

        if (operation === 'add') {
          newQuantity = currentItem.quantity + quantityChange;
          newAverageCost = newQuantity > 0 ? (currentTotalValue + changeTotalValue) / newQuantity : 0;
        } else { // subtract
          newQuantity = currentItem.quantity - quantityChange;
          newAverageCost = currentItem.cost; // Cost doesn't change on subtraction
        }
        
        updatedInventory[itemIndex] = {
          ...currentItem,
          quantity: Math.max(0, newQuantity),
          cost: newAverageCost,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        return updatedInventory;

      } else {
        if (operation === 'add') {
           const newItem = {
             id: `INV-${Date.now()}`,
             productId: parseInt(productId),
             warehouseId: warehouseId,
             quantity: quantityChange,
             cost: newCost,
             minStock: 10,
             maxStock: 100,
             lastUpdated: new Date().toISOString().split('T')[0]
           };
           return [...prev, newItem];
        }
        return prev;
      }
    });
  };

  const addInventoryMovement = (movementData) => {
    const { type, warehouseId, warehouseTo, items } = movementData;
    setInventoryMovements(prev => [...prev, movementData]);

    items.forEach(item => {
      const quantity = parseInt(item.quantity);
      const cost = parseFloat(item.cost);
      if (type === 'entrada') {
        updateStock(item.productId, warehouseId, quantity, cost, 'add');
      } else if (type === 'salida') {
        updateStock(item.productId, warehouseId, quantity, cost, 'subtract');
      } else if (type === 'traslado') {
        updateStock(item.productId, warehouseId, quantity, cost, 'subtract');
        updateStock(item.productId, warehouseTo, quantity, cost, 'add');
      }
    });
  };

  const updateInventoryMovement = (movementData) => {
    // NOTE: This is a simplified update. A real-world scenario would require
    // reversing the old stock movement and applying the new one, which is complex.
    // For now, we just update the movement record itself.
    setInventoryMovements(prev => prev.map(m => m.id === movementData.id ? movementData : m));
  };

  const updateInventoryItem = (itemId, updatedData) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, ...updatedData, lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  const deleteInventoryItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const getInventoryByWarehouse = (warehouseId) => {
    return inventory.filter(item => item.warehouseId === warehouseId);
  };

  const getLowStockItems = (warehouseId) => {
    return inventory.filter(item => 
      item.warehouseId === warehouseId && item.quantity <= item.minStock
    );
  };

  const calculateProfitMargin = (productId, warehouseId, salePrice) => {
    const cost = getProductCost(productId, warehouseId);
    if (cost === 0) return 0;
    
    const profit = salePrice - cost;
    const margin = (profit / salePrice) * 100;
    return margin;
  };

  return {
    inventory,
    inventoryMovements,
    getNextMovementId,
    getProductStock,
    getProductCost,
    validateStock,
    updateStock,
    addInventoryMovement,
    updateInventoryMovement,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryByWarehouse,
    getLowStockItems,
    calculateProfitMargin
  };
};