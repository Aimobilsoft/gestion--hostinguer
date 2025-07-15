import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Tags, PlusCircle, Trash2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PriceListForm = ({ isOpen, onClose, onSave, priceList, products, formatCurrency }) => {
  const getInitialFormData = () => ({
    name: '',
    description: '',
    items: [],
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (priceList) {
      setFormData({ ...getInitialFormData(), ...priceList });
    } else {
      setFormData(getInitialFormData());
    }
  }, [priceList, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && !formData.items.some(item => item.productId === productId)) {
      const newItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
      };
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isEditing = !!priceList;

  const availableProducts = products.filter(p => 
    !formData.items.some(item => item.productId === p.id) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Tags />
            {isEditing ? 'Editar Lista de Precios' : 'Nueva Lista de Precios'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles y precios de la lista.' : 'Complete los detalles y agregue productos a la lista.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Lista</Label>
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej: Precios de Fin de Semana" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Descripción breve de la lista de precios." />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Productos en la Lista</h3>
            <div className="border rounded-lg p-2 space-y-2">
              {formData.items.map((item, index) => (
                <div key={item.productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 font-medium">{item.productName}</span>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {formData.items.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay productos en esta lista.</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Agregar Productos</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Buscar producto para agregar..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select onValueChange={handleAddItem}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({formatCurrency(product.price)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

export default PriceListForm;