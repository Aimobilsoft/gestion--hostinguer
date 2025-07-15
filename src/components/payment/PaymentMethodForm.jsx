import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

const PaymentMethodForm = ({ isOpen, onClose, onSave, paymentMethod }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'efectivo',
    description: '',
    accountCode: '',
    accountName: '',
    requiresReference: false,
    isActive: true
  });

  useEffect(() => {
    if (isOpen) {
      if (paymentMethod) {
        setFormData(paymentMethod);
      } else {
        setFormData({
          name: '',
          code: '',
          type: 'efectivo',
          description: '',
          accountCode: '',
          accountName: '',
          requiresReference: false,
          isActive: true
        });
      }
    }
  }, [paymentMethod, isOpen]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isEditing = !!paymentMethod;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Forma de Pago' : 'Nueva Forma de Pago'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles de la forma de pago.' : 'Complete los detalles para crear una nueva forma de pago.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej: Efectivo, Tarjeta Crédito" />
            </div>
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={formData.code} onChange={handleChange} placeholder="Ej: EFE, TC, CHE" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="credito">Crédito</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="isActive">Estado</Label>
              <Select value={formData.isActive ? 'true' : 'false'} onValueChange={(value) => handleSelectChange('isActive', value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Descripción opcional de la forma de pago" />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 text-gray-700">Configuración Contable</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountCode">Código de Cuenta</Label>
                <Input id="accountCode" value={formData.accountCode} onChange={handleChange} placeholder="Ej: 1105, 1110, 2205" />
              </div>
              <div>
                <Label htmlFor="accountName">Nombre de la Cuenta</Label>
                <Input id="accountName" value={formData.accountName} onChange={handleChange} placeholder="Ej: Caja General, Bancos, Cuentas por Pagar" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="requiresReference" 
              checked={formData.requiresReference} 
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="requiresReference" className="text-sm">Requiere número de referencia (cheque, transferencia, etc.)</Label>
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

export default PaymentMethodForm;