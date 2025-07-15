import { useState } from 'react';

export const useCatalogHandlers = ({
  addCategory,
  updateCategory,
  deleteCategory,
  addProductLine,
  updateProductLine,
  deleteProductLine,
  toast,
  setConfirmation
}) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLineFormOpen, setIsLineFormOpen] = useState(false);
  const [editingLine, setEditingLine] = useState(null);

  const handleOpenCategoryForm = (category = null) => { 
    setEditingCategory(category); 
    setIsCategoryFormOpen(true); 
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) { 
      updateCategory(editingCategory.id, categoryData); 
      toast({ title: 'Categoría Actualizada' }); 
    } else { 
      addCategory(categoryData); 
      toast({ title: 'Categoría Creada' }); 
    }
    setIsCategoryFormOpen(false); 
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    setConfirmation({ 
      isOpen: true, 
      title: 'Eliminar Categoría', 
      description: '¿Estás seguro? Se eliminarán las líneas y productos asociados.', 
      onConfirm: () => {
        deleteCategory(categoryId); 
        toast({ title: 'Categoría Eliminada' }); 
        setConfirmation({ isOpen: false });
      }
    });
  };

  const handleOpenLineForm = (line = null) => { 
    setEditingLine(line); 
    setIsLineFormOpen(true); 
  };

  const handleSaveLine = (lineData) => {
    if (editingLine) { 
      updateProductLine(editingLine.id, lineData); 
      toast({ title: 'Línea Actualizada' }); 
    } else { 
      addProductLine(lineData); 
      toast({ title: 'Línea Creada' }); 
    }
    setIsLineFormOpen(false); 
    setEditingLine(null);
  };

  const handleDeleteLine = (lineId) => {
    setConfirmation({ 
      isOpen: true, 
      title: 'Eliminar Línea', 
      description: '¿Estás seguro? Se eliminarán los productos asociados.', 
      onConfirm: () => {
        deleteProductLine(lineId); 
        toast({ title: 'Línea Eliminada' }); 
        setConfirmation({ isOpen: false });
      }
    });
  };

  return {
    isCategoryFormOpen,
    setIsCategoryFormOpen,
    editingCategory,
    isLineFormOpen,
    setIsLineFormOpen,
    editingLine,
    handleOpenCategoryForm,
    handleSaveCategory,
    handleDeleteCategory,
    handleOpenLineForm,
    handleSaveLine,
    handleDeleteLine
  };
};