import { useState, useCallback } from 'react';

export const useSalesHandlers = ({
  addSeller,
  updateSeller,
  toggleSellerStatus,
  addPriceList,
  updatePriceList,
  togglePriceListStatus,
  toast,
  setConfirmation
}) => {
  const [isSellerFormOpen, setIsSellerFormOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [isPriceListFormOpen, setIsPriceListFormOpen] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState(null);

  // Seller Handlers
  const handleOpenSellerForm = useCallback((seller = null) => {
    setEditingSeller(seller);
    setIsSellerFormOpen(true);
  }, []);

  const handleSaveSeller = useCallback((sellerData) => {
    if (editingSeller) {
      updateSeller(editingSeller.id, sellerData);
      toast({ title: 'Vendedor Actualizado' });
    } else {
      addSeller(sellerData);
      toast({ title: 'Vendedor Creado' });
    }
    setIsSellerFormOpen(false);
    setEditingSeller(null);
  }, [editingSeller, addSeller, updateSeller, toast]);

  const handleToggleSellerStatus = useCallback((sellerId) => {
    const seller = toggleSellerStatus(sellerId);
    const newStatus = seller.isActive ? 'activado' : 'desactivado';
    toast({ title: `Vendedor ${newStatus}`, description: `El vendedor "${seller.name}" ha sido ${newStatus}.` });
  }, [toggleSellerStatus, toast]);

  // Price List Handlers
  const handleOpenPriceListForm = useCallback((priceList = null) => {
    setEditingPriceList(priceList);
    setIsPriceListFormOpen(true);
  }, []);

  const handleSavePriceList = useCallback((priceListData) => {
    if (editingPriceList) {
      updatePriceList(editingPriceList.id, priceListData);
      toast({ title: 'Lista de Precios Actualizada' });
    } else {
      addPriceList(priceListData);
      toast({ title: 'Lista de Precios Creada' });
    }
    setIsPriceListFormOpen(false);
    setEditingPriceList(null);
  }, [editingPriceList, addPriceList, updatePriceList, toast]);

  const handleTogglePriceListStatus = useCallback((listId) => {
    const list = togglePriceListStatus(listId);
    const newStatus = list.isActive ? 'activada' : 'desactivada';
    toast({ title: `Lista ${newStatus}`, description: `La lista de precios "${list.name}" ha sido ${newStatus}.` });
  }, [togglePriceListStatus, toast]);

  return {
    isSellerFormOpen,
    setIsSellerFormOpen,
    editingSeller,
    handleOpenSellerForm,
    handleSaveSeller,
    handleToggleSellerStatus,
    isPriceListFormOpen,
    setIsPriceListFormOpen,
    editingPriceList,
    handleOpenPriceListForm,
    handleSavePriceList,
    handleTogglePriceListStatus,
  };
};