import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

const CategoryForm = ({ isOpen, onClose, onSave, category, getNextCategoryId }) => {
  const getInitialFormData = () => ({
    name: '',
    code: getNextCategoryId(),
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

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          code: category.id,
          accountingConfig: category.accountingConfig || getInitialFormData().accountingConfig
        });
      } else {
        setFormData(getInitialFormData());
      }
    }
  }, [category, isOpen, getNextCategoryId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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

  const handleSubmit = () => {
    onSave({ 
      id: formData.code, 
      name: formData.name,
      accountingConfig: formData.accountingConfig
    });
  };

  const isEditing = !!category;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice el nombre y configuración contable de la categoría.' : 'Complete el nombre y configuración contable para la nueva categoría.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={formData.code} readOnly className="bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4 text-gray-700">Configuración Contable por Defecto</h4>
            <p className="text-sm text-gray-600 mb-4">
              Estas cuentas se aplicarán por defecto a todos los productos de esta categoría. 
              Pueden ser personalizadas individualmente en cada producto.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchaseAccount">Cuenta de Compra/Inventarios</Label>
                <Input 
                  id="purchaseAccount" 
                  value={formData.accountingConfig.purchaseAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 1435 - Mercancías no Fabricadas"
                />
              </div>
              <div>
                <Label htmlFor="inventoryAccount">Cuenta de Inventario</Label>
                <Input 
                  id="inventoryAccount" 
                  value={formData.accountingConfig.inventoryAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 1435 - Inventario de Mercancías"
                />
              </div>
              <div>
                <Label htmlFor="ivaGeneratedAccount">Cuenta IVA Generado</Label>
                <Input 
                  id="ivaGeneratedAccount" 
                  value={formData.accountingConfig.ivaGeneratedAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 2408 - IVA por Pagar"
                />
              </div>
              <div>
                <Label htmlFor="retefuenteAccount">Cuenta ReteFuente</Label>
                <Input 
                  id="retefuenteAccount" 
                  value={formData.accountingConfig.retefuenteAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 2365 - Retención en la Fuente"
                />
              </div>
              <div>
                <Label htmlFor="reteicaAccount">Cuenta ReteICA</Label>
                <Input 
                  id="reteicaAccount" 
                  value={formData.accountingConfig.reteicaAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 2368 - Retención ICA"
                />
              </div>
              <div>
                <Label htmlFor="incomeAccount">Cuenta de Ingreso</Label>
                <Input 
                  id="incomeAccount" 
                  value={formData.accountingConfig.incomeAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 4135 - Comercio al por Mayor y Menor"
                />
              </div>
              <div>
                <Label htmlFor="costOfSalesAccount">Cuenta de Costo de Venta</Label>
                <Input 
                  id="costOfSalesAccount" 
                  value={formData.accountingConfig.costOfSalesAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 6135 - Comercio al por Mayor y Menor"
                />
              </div>
              <div>
                <Label htmlFor="inventoryWithdrawalAccount">Cuenta Retiro de Inventario</Label>
                <Input 
                  id="inventoryWithdrawalAccount" 
                  value={formData.accountingConfig.inventoryWithdrawalAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 1435 - Salida de Inventario"
                />
              </div>
            </div>
          </div>
        </div>
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

export default CategoryForm;