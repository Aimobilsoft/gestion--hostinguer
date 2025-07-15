import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WarehouseEntryHeader = ({ 
  formData, 
  setFormData, 
  pendingOrders, 
  suppliers, 
  warehouses,
  handleChange,
  handleSelectChange 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="purchaseOrderId">Orden de Compra</Label>
        <Select value={formData.purchaseOrderId} onValueChange={(value) => handleSelectChange('purchaseOrderId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una orden de compra" />
          </SelectTrigger>
          <SelectContent>
            {pendingOrders.map(order => (
              <SelectItem key={order.id} value={order.id}>
                {order.id} - {suppliers.find(s => s.id === order.supplierId)?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="entryDate">Fecha de Entrada</Label>
        <Input 
          id="entryDate" 
          type="date" 
          value={formData.entryDate} 
          onChange={handleChange} 
        />
      </div>
    </div>
  );
};

export default WarehouseEntryHeader;