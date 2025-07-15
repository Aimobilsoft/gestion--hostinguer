import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import ProductFormGeneral from '@/components/product/ProductFormGeneral';
import ProductFormAccounting from '@/components/product/ProductFormAccounting';

const ProductForm = ({ isOpen, onClose, onSave, product, categories, productLines, getNextProductCode, calculateProfitMargin, currentWarehouse }) => {
  const getInitialFormData = () => ({
    name: '',
    code: 'Seleccione una línea',
    price: '',
    cost: '',
    tax: '19',
    description: '',
    categoryId: '',
    lineId: '',
    requiresInventoryControl: false,
    accountingConfig: {
      purchaseAccount: '',
      inventoryAccount: '',
      ivaGeneratedAccount: '2408',
      retefuenteAccount: '2365',
      reteicaAccount: '2368',
      incomeAccount: '',
      costOfSalesAccount: '',
      inventoryWithdrawalAccount: ''
    }
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [filteredLines, setFilteredLines] = useState([]);
  const [profitMargin, setProfitMargin] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          ...getInitialFormData(),
          ...product,
          price: String(product.price),
          cost: String(product.cost || 0),
          tax: String(product.tax),
        });
        if (product.categoryId) {
          setFilteredLines(productLines.filter(line => line.categoryId === product.categoryId));
        }
      } else {
        setFormData(getInitialFormData());
        setFilteredLines([]);
      }
    }
  }, [product, isOpen, productLines]);
  
  useEffect(() => {
    if (formData.lineId && !product) {
      const code = getNextProductCode(formData.lineId);
      setFormData(prev => ({ ...prev, code }));
    } else if (!formData.lineId && !product) {
      setFormData(prev => ({ ...prev, code: 'Seleccione una línea' }));
    }
  }, [formData.lineId, product, getNextProductCode]);

  useEffect(() => {
    if (formData.price && formData.cost) {
      const price = parseFloat(formData.price) || 0;
      const cost = parseFloat(formData.cost) || 0;
      if (price > 0) {
        const margin = ((price - cost) / price) * 100;
        setProfitMargin(margin);
      } else {
        setProfitMargin(0);
      }
    }
  }, [formData.price, formData.cost]);

  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    const categoryLines = productLines.filter(line => line.categoryId === categoryId);
    
    const isService = selectedCategory?.name === 'Servicios';
    
    setFormData(prev => ({ 
      ...prev, 
      categoryId, 
      lineId: '', 
      code: 'Seleccione una línea',
      requiresInventoryControl: !isService,
      accountingConfig: selectedCategory?.accountingConfig 
        ? { ...prev.accountingConfig, ...selectedCategory.accountingConfig }
        : prev.accountingConfig
    }));
    setFilteredLines(categoryLines);
  };
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleLineChange = (lineId) => {
    const selectedLine = productLines.find(l => l.id === lineId);
    setFormData(prev => ({ 
      ...prev, 
      lineId,
      accountingConfig: selectedLine?.accountingConfig 
        ? { ...prev.accountingConfig, ...selectedLine.accountingConfig }
        : prev.accountingConfig
    }));
  };

  const handleAccountingChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      accountingConfig: {
        ...prev.accountingConfig,
        [id]: value
      }
    }));
  };

  const handleInventoryControlChange = (checked) => {
    setFormData(prev => ({ ...prev, requiresInventoryControl: checked }));
  };

  const handleSubmit = () => {
    onSave({
        ...formData,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        tax: parseInt(formData.tax, 10) || 0,
    });
  };

  const isEditing = !!product;
  const selectedCategory = categories.find(c => c.id === formData.categoryId);
  const selectedLine = productLines.find(l => l.id === formData.lineId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles del producto.' : 'Complete los detalles para crear un nuevo producto.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="accounting">Configuración Contable</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <ProductFormGeneral
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              productLines={productLines}
              filteredLines={filteredLines}
              setFilteredLines={setFilteredLines}
              profitMargin={profitMargin}
              handleCategoryChange={handleCategoryChange}
              handleLineChange={handleLineChange}
              handleChange={handleChange}
              handleInventoryControlChange={handleInventoryControlChange}
            />
          </TabsContent>
          
          <TabsContent value="accounting">
            <ProductFormAccounting
              formData={formData}
              handleAccountingChange={handleAccountingChange}
              selectedCategory={selectedCategory}
              selectedLine={selectedLine}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" /> Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;