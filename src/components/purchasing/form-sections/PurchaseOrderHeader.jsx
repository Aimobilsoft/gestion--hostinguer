import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PurchaseOrderHeader = ({ formData, setFormData, suppliers, warehouses }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplierId">Proveedor</Label>
          <Select value={formData.supplierId} onValueChange={(value) => handleSelectChange('supplierId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.nit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="warehouseId">Bodega</Label>
          <Select value={formData.warehouseId} onValueChange={(value) => handleSelectChange('warehouseId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una bodega" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map(warehouse => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orderDate">Fecha de Orden</Label>
          <Input 
            id="orderDate" 
            type="date" 
            value={formData.orderDate} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="expectedDate">Fecha Esperada</Label>
          <Input 
            id="expectedDate" 
            type="date" 
            value={formData.expectedDate} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderHeader;