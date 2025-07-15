import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calculator } from 'lucide-react';

const PurchaseOrderItemsSection = ({ 
  formData, 
  setFormData, 
  newItem, 
  setNewItem, 
  products, 
  formatCurrency,
  subtotal,
  tax,
  total
}) => {
  const handleNewItemChange = (e) => {
    const { id, value } = e.target;
    setNewItem(prev => ({ ...prev, [id]: value }));
  };

  const handleNewItemSelectChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    if (!newItem.productId || newItem.quantity <= 0 || newItem.unitCost <= 0) return;

    const product = products.find(p => p.id === parseInt(newItem.productId));
    if (!product) return;

    const item = {
      productId: parseInt(newItem.productId),
      name: product.name,
      quantity: parseInt(newItem.quantity),
      unitCost: parseFloat(newItem.unitCost),
      totalCost: parseInt(newItem.quantity) * parseFloat(newItem.unitCost)
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), item]
    }));

    setNewItem({ productId: '', quantity: 1, unitCost: 0 });
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  const updateItemQuantity = (index, quantity) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map((item, i) => 
        i === index 
          ? { ...item, quantity: parseInt(quantity), totalCost: parseInt(quantity) * item.unitCost }
          : item
      )
    }));
  };

  const updateItemCost = (index, unitCost) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map((item, i) => 
        i === index 
          ? { ...item, unitCost: parseFloat(unitCost), totalCost: item.quantity * parseFloat(unitCost) }
          : item
      )
    }));
  };

  return (
    <>
      {/* Add New Item */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-800 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Producto
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="productId">Producto</Label>
              <Select value={newItem.productId} onValueChange={(value) => handleNewItemSelectChange('productId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.code} - {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1" 
                value={newItem.quantity} 
                onChange={handleNewItemChange} 
              />
            </div>
            <div>
              <Label htmlFor="unitCost">Costo Unitario</Label>
              <Input 
                id="unitCost" 
                type="number" 
                min="0" 
                step="0.01" 
                value={newItem.unitCost} 
                onChange={handleNewItemChange} 
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      {formData.items && formData.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Productos en la Orden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Producto</th>
                    <th className="text-center py-2">Cantidad</th>
                    <th className="text-right py-2">Costo Unit.</th>
                    <th className="text-right py-2">Total</th>
                    <th className="text-center py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-center">
                        <Input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => updateItemQuantity(index, e.target.value)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="py-2 text-right">
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={item.unitCost} 
                          onChange={(e) => updateItemCost(index, e.target.value)}
                          className="w-32 text-right"
                        />
                      </td>
                      <td className="py-2 text-right font-semibold">
                        {formatCurrency(item.totalCost)}
                      </td>
                      <td className="py-2 text-center">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (19%):</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default PurchaseOrderItemsSection;