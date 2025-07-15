import { useState } from 'react';

export const useProductHandlers = ({
  addProduct,
  updateProduct,
  toggleProductStatus,
  toast,
  setConfirmation
}) => {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleOpenProductForm = (product = null) => { 
    setEditingProduct(product); 
    setIsProductFormOpen(true); 
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) { 
      updateProduct(editingProduct.id, productData); 
      toast({ title: 'Producto Actualizado', description: 'Los cambios se han guardado correctamente.' }); 
    } else { 
      addProduct(productData); 
      toast({ title: 'Producto Creado', description: 'El nuevo producto está listo para usarse.' }); 
    }
    setIsProductFormOpen(false); 
    setEditingProduct(null);
  };

  const handleToggleProductStatus = (productId) => {
    const product = toggleProductStatus(productId);
    toast({
      title: `Producto ${product.status === 'active' ? 'Activado' : 'Desactivado'}`,
      description: `El producto "${product.name}" ha sido ${product.status === 'active' ? 'activado' : 'desactivado'}.`
    });
  };

  return {
    isProductFormOpen,
    setIsProductFormOpen,
    editingProduct,
    handleOpenProductForm,
    handleSaveProduct,
    handleToggleProductStatus
  };
};