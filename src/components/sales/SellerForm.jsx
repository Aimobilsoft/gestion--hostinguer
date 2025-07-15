import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save, UserCheck } from 'lucide-react';

const SellerForm = ({ isOpen, onClose, onSave, seller }) => {
  const getInitialFormData = () => ({
    name: '',
    email: '',
    commissionRate: 0,
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (seller) {
      setFormData({ ...getInitialFormData(), ...seller });
    } else {
      setFormData(getInitialFormData());
    }
  }, [seller, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isEditing = !!seller;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserCheck />
            {isEditing ? 'Editar Vendedor' : 'Nuevo Vendedor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles del vendedor.' : 'Complete los detalles para crear un nuevo vendedor.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej: Juan Rodríguez" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="ej: juan.r@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commissionRate">Tasa de Comisión (%)</Label>
            <Input id="commissionRate" type="number" value={formData.commissionRate} onChange={handleNumberChange} placeholder="Ej: 5.5" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" /> Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellerForm;