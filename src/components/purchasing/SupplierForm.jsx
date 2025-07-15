import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Users, BookUser } from 'lucide-react';

const SupplierForm = ({ isOpen, onClose, onSave, supplier }) => {
  const getInitialFormData = () => ({
    name: '',
    nit: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    paymentTerms: 30,
    isActive: true,
    accountingConfig: {
      payableAccount: '2205',
      payableAccountName: 'Proveedores Nacionales',
      advanceAccount: '1355',
      advanceAccountName: 'Anticipos a Proveedores'
    }
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        setFormData({
          ...getInitialFormData(),
          ...supplier,
        });
      } else {
        setFormData(getInitialFormData());
      }
    }
  }, [supplier, isOpen]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
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
      ...formData,
      paymentTerms: parseInt(formData.paymentTerms) || 30
    });
  };

  const isEditing = !!supplier;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text flex items-center">
            <Users className="w-6 h-6 mr-2" />
            {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles del proveedor.' : 'Complete los detalles para crear un nuevo proveedor.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="accounting">Configuración Contable</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre del Proveedor</Label>
                <Input id="name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="nit">NIT</Label>
                <Input id="nit" value={formData.nit} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Textarea id="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Persona de Contacto</Label>
                <Input id="contactPerson" value={formData.contactPerson} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Plazo de Pago (días)</Label>
                <Input 
                  id="paymentTerms" 
                  type="number" 
                  min="0" 
                  value={formData.paymentTerms} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="isActive">Proveedor Activo</Label>
            </div>
          </TabsContent>

          <TabsContent value="accounting" className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><BookUser />Configuración Contable</h4>
              <p className="text-sm text-blue-700">
                Configure las cuentas contables que se utilizarán por defecto para este proveedor en las transacciones de compra.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payableAccount">Cuenta por Pagar (Código)</Label>
                <Input 
                  id="payableAccount" 
                  value={formData.accountingConfig.payableAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 2205"
                />
              </div>
              <div>
                <Label htmlFor="payableAccountName">Nombre Cuenta por Pagar</Label>
                <Input 
                  id="payableAccountName" 
                  value={formData.accountingConfig.payableAccountName} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: Proveedores Nacionales"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="advanceAccount">Cuenta de Anticipos (Código)</Label>
                <Input 
                  id="advanceAccount" 
                  value={formData.accountingConfig.advanceAccount} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: 1355"
                />
              </div>
              <div>
                <Label htmlFor="advanceAccountName">Nombre Cuenta de Anticipos</Label>
                <Input 
                  id="advanceAccountName" 
                  value={formData.accountingConfig.advanceAccountName} 
                  onChange={handleAccountingChange}
                  placeholder="Ej: Anticipos a Proveedores"
                />
              </div>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4 mt-4">
              <h5 className="font-medium mb-2">Resumen de Configuración</h5>
              <div className="text-sm space-y-1">
                <p><strong>Cuenta por Pagar:</strong> {formData.accountingConfig.payableAccount} - {formData.accountingConfig.payableAccountName}</p>
                <p><strong>Cuenta de Anticipos:</strong> {formData.accountingConfig.advanceAccount} - {formData.accountingConfig.advanceAccountName}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" /> 
            {isEditing ? 'Actualizar Proveedor' : 'Crear Proveedor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierForm;