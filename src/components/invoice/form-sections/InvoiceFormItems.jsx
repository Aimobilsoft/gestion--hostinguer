import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const InvoiceFormItems = ({
  items,
  setItems,
  products,
  getProductStock,
  currentWarehouse,
  stockValidationErrors,
  formatCurrency
}) => {
  const [newItem, setNewItem] = useState({ productId: '', quantity: 1, discount: 0 });

  const handleNewItemChange = (field, value) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (!newItem.productId) return;
    const product = products.find(p => p.id === parseInt(newItem.productId));
    if (!product) return;

    const stock = getProductStock(product.id, currentWarehouse?.id);
    const item = {
      productId: product.id.toString(),
      name: product.name,
      code: product.code,
      unit: product.unit,
      stock: stock,
      tax: product.tax,
      price: product.price,
      quantity: Number(newItem.quantity),
      discount: Number(newItem.discount),
      requiresInventoryControl: product.requiresInventoryControl || false,
    };
    setItems([...items, item]);
    setNewItem({ productId: '', quantity: 1, discount: 0 });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = Number(value);
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const selectedProductForNewItem = products.find(p => p.id === parseInt(newItem.productId));

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-x-2 items-end">
            <div className="col-span-5"><Label className="text-xs font-medium">Producto</Label><Select value={newItem.productId} onValueChange={(value) => handleNewItemChange('productId', value)}><SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Seleccionar producto" /></SelectTrigger><SelectContent>{products.map(p => (<SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="col-span-1"><Label className="text-xs font-medium">Unidad</Label><Input value={selectedProductForNewItem?.unit || ''} readOnly className="bg-gray-100 h-7 text-xs text-center" /></div>
            <div className="col-span-1"><Label className="text-xs font-medium">Existencia</Label><Input value={selectedProductForNewItem?.id ? getProductStock(selectedProductForNewItem.id, currentWarehouse?.id) : '0'} readOnly className="bg-gray-100 h-7 text-xs text-center" /></div>
            <div className="col-span-2"><Label className="text-xs font-medium">Valor Unitario</Label><Input value={formatCurrency(selectedProductForNewItem?.price || 0)} readOnly className="bg-gray-100 h-7 text-xs text-right" /></div>
            <div className="col-span-1"><Label className="text-xs font-medium">Cantidad</Label><Input type="number" min="1" value={newItem.quantity} onChange={(e) => handleNewItemChange('quantity', e.target.value)} className="h-7 text-xs text-center" /></div>
            <div className="col-span-1"><Label className="text-xs font-medium">Descuento</Label><Input type="number" min="0" max="100" value={newItem.discount} onChange={(e) => handleNewItemChange('discount', e.target.value)} className="h-7 text-xs text-center" /></div>
            <div className="col-span-1"><Label className="text-xs font-medium invisible">Add</Label><Button onClick={handleAddItem} size="icon" className="h-7 w-full bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4" /></Button></div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left font-medium text-gray-600 text-xs">Producto</th>
                <th className="p-2 w-16 text-center font-medium text-gray-600 text-xs">Unidad</th>
                <th className="p-2 w-16 text-center font-medium text-gray-600 text-xs">Exist.</th>
                <th className="p-2 w-24 text-right font-medium text-gray-600 text-xs">Vr. Unitario</th>
                <th className="p-2 w-20 text-center font-medium text-gray-600 text-xs">Cantidad</th>
                <th className="p-2 w-16 text-center font-medium text-gray-600 text-xs">% IVA</th>
                <th className="p-2 w-20 text-center font-medium text-gray-600 text-xs">% Descto</th>
                <th className="p-2 w-28 text-right font-medium text-gray-600 text-xs">Total</th>
                <th className="p-2 w-12 text-center font-medium text-gray-600 text-xs">Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const stockError = stockValidationErrors.find(e => e.productId === item.productId);
                const total = (item.quantity * item.price) * (1 - item.discount / 100);
                return (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="p-1 text-xs">{item.name}</td>
                    <td className="p-1 text-xs text-center">{item.unit}</td>
                    <td className="p-1 text-xs text-center">{item.stock}</td>
                    <td className="p-1 text-xs text-right">{formatCurrency(item.price)}</td>
                    <td className="p-1">
                      <Input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className={`h-7 text-xs text-center ${stockError ? 'border-red-500' : ''}`} />
                      {stockError && <p className="text-red-500 text-xs mt-1 text-center">Max: {stockError.available}</p>}
                    </td>
                    <td className="p-1 text-xs text-center">{item.tax}%</td>
                    <td className="p-1"><Input type="number" min="0" max="100" value={item.discount} onChange={(e) => handleItemChange(index, 'discount', e.target.value)} className="h-7 text-xs text-center" /></td>
                    <td className="p-1 text-xs text-right font-medium">{formatCurrency(total)}</td>
                    <td className="p-1 text-center"><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="h-7 w-7 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center text-gray-500 p-8">No hay productos agregados a la factura.</div>
        )}
      </div>
    </div>
  );
};

export default InvoiceFormItems;