import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ClientForm = ({ isOpen, onClose, onSave, client, sellers = [], priceLists = [] }) => {
  const getInitialFormData = () => ({
    name: '',
    nit: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    taxRegime: 'Régimen Común',
    creditLimit: 0,
    assignedSalespersonId: '',
    priceListId: '',
    isActive: true,
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (client) {
      setFormData({
        ...getInitialFormData(),
        ...client,
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [client, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isEditing = !!client;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles del cliente.' : 'Complete los detalles para crear un nuevo cliente.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="nit">NIT / Cédula</Label>
              <Input id="nit" value={formData.nit} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" value={formData.address} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="taxRegime">Régimen Tributario</Label>
              <Select onValueChange={(value) => handleSelectChange('taxRegime', value)} value={formData.taxRegime}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Régimen Común">Régimen Común</SelectItem>
                  <SelectItem value="Régimen Simplificado">Régimen Simplificado</SelectItem>
                  <SelectItem value="Gran Contribuyente">Gran Contribuyente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="creditLimit">Cupo de Crédito</Label>
              <Input id="creditLimit" type="number" value={formData.creditLimit} onChange={handleNumberChange} />
            </div>
            <div>
              <Label htmlFor="assignedSalespersonId">Vendedor Asignado</Label>
              <Select onValueChange={(value) => handleSelectChange('assignedSalespersonId', value)} value={formData.assignedSalespersonId}>
                <SelectTrigger><SelectValue placeholder="Seleccione un vendedor" /></SelectTrigger>
                <SelectContent>
                  {sellers.map(seller => (
                    <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priceListId">Lista de Precios</Label>
              <Select onValueChange={(value) => handleSelectChange('priceListId', value)} value={formData.priceListId}>
                <SelectTrigger><SelectValue placeholder="Seleccione una lista" /></SelectTrigger>
                <SelectContent>
                  {priceLists.map(list => (
                    <SelectItem key={list.id} value={list.id}>{list.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default ClientForm;