import { useState, useCallback } from 'react';

const initialSellers = [
  { id: 'VEND-01', name: 'Carlos Ramirez', email: 'carlos.ramirez@example.com', commissionRate: 5, isActive: true },
  { id: 'VEND-02', name: 'Ana Gutierrez', email: 'ana.gutierrez@example.com', commissionRate: 5.5, isActive: true },
];

const initialPriceLists = [
  { id: 'PL-01', name: 'General', description: 'Lista de precios estándar para todos los clientes.', isActive: true },
  { id: 'PL-02', name: 'Mayorista', description: 'Precios especiales para compras al por mayor.', isActive: true },
];

export const useSalesData = () => {
  const [sellers, setSellers] = useState(initialSellers);
  const [priceLists, setPriceLists] = useState(initialPriceLists);

  // Seller management
  const addSeller = useCallback((sellerData) => {
    const newSeller = { ...sellerData, id: `VEND-${String(sellers.length + 1).padStart(2, '0')}`, isActive: true };
    setSellers(prev => [newSeller, ...prev]);
    return newSeller;
  }, [sellers.length]);

  const updateSeller = useCallback((sellerId, updatedData) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, ...updatedData } : s));
  }, []);

  const toggleSellerStatus = useCallback((sellerId) => {
    let updatedSeller = null;
    setSellers(prev => prev.map(s => {
      if (s.id === sellerId) {
        updatedSeller = { ...s, isActive: !s.isActive };
        return updatedSeller;
      }
      return s;
    }));
    return updatedSeller;
  }, []);

  // Price List management
  const addPriceList = useCallback((priceListData) => {
    const newPriceList = { ...priceListData, id: `PL-${String(priceLists.length + 1).padStart(2, '0')}`, isActive: true };
    setPriceLists(prev => [newPriceList, ...prev]);
    return newPriceList;
  }, [priceLists.length]);

  const updatePriceList = useCallback((listId, updatedData) => {
    setPriceLists(prev => prev.map(l => l.id === listId ? { ...l, ...updatedData } : l));
  }, []);

  const togglePriceListStatus = useCallback((listId) => {
    let updatedList = null;
    setPriceLists(prev => prev.map(l => {
      if (l.id === listId) {
        updatedList = { ...l, isActive: !l.isActive };
        return updatedList;
      }
      return l;
    }));
    return updatedList;
  }, []);

  return {
    sellers,
    addSeller,
    updateSeller,
    toggleSellerStatus,
    priceLists,
    addPriceList,
    updatePriceList,
    togglePriceListStatus,
  };
};