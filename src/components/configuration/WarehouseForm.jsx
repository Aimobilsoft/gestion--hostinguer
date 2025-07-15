import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

const WarehouseForm = ({ isOpen, onClose, onSave, warehouse, branches }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    branchId: '',
    address: '',
    manager: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (warehouse) {
        setFormData(warehouse);
      } else {
        setFormData({
          name: '',
          code: '',
          branchId: '',
          address: '',
          manager: '',
        });
      }
    }
  }, [warehouse, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, branchId: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isEditing = !!warehouse;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Bodega' : 'Nueva Bodega'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles de la bodega.' : 'Complete los detalles para crear una nueva bodega.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre de la Bodega</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={formData.code} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="branchId">Sede</Label>
            <Select value={formData.branchId} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una sede" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="manager">Responsable</Label>
            <Input id="manager" value={formData.manager} onChange={handleChange} />
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

export default WarehouseForm;