import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, TrendingUp, Package } from 'lucide-react';

const ProductFormGeneral = ({ 
  formData, 
  setFormData, 
  categories, 
  productLines, 
  filteredLines, 
  setFilteredLines,
  profitMargin,
  handleCategoryChange,
  handleLineChange,
  handleChange,
  handleInventoryControlChange
}) => {
  const getProfitMarginColor = (margin) => {
    if (margin < 10) return 'text-red-600';
    if (margin < 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProfitMarginIcon = (margin) => {
    if (margin < 10) return <AlertTriangle className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categoryId">Categoría</Label>
          <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="lineId">Línea</Label>
          <Select value={formData.lineId} onValueChange={handleLineChange} disabled={!formData.categoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una línea" />
            </SelectTrigger>
            <SelectContent>
              {filteredLines.map(line => <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Código</Label>
          <Input id="code" value={formData.code} readOnly className="bg-gray-100" />
        </div>
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={formData.name} onChange={handleChange} />
        </div>
      </div>

      {/* Inventory Control Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Package className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-800">Control de Inventario</h4>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="requiresInventoryControl" 
            checked={formData.requiresInventoryControl} 
            onCheckedChange={handleInventoryControlChange} 
          />
          <Label htmlFor="requiresInventoryControl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Este producto requiere control de inventario
          </Label>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          {formData.requiresInventoryControl 
            ? "✓ Se validará stock disponible antes de facturar y se actualizará automáticamente el inventario."
            : "⚠ No se validará stock. Ideal para servicios que no requieren control de existencias."
          }
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cost">Costo</Label>
          <Input id="cost" type="number" value={formData.cost} onChange={handleChange} placeholder="0" />
        </div>
        <div>
          <Label htmlFor="price">Precio de Venta</Label>
          <Input id="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" />
        </div>
        <div>
          <Label htmlFor="tax">IVA (%)</Label>
          <Input id="tax" type="number" value={formData.tax} onChange={handleChange} />
        </div>
      </div>

      {formData.price && formData.cost && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Análisis de Rentabilidad:</span>
            <div className={`flex items-center gap-1 ${getProfitMarginColor(profitMargin)}`}>
              {getProfitMarginIcon(profitMargin)}
              <span className="font-bold">{profitMargin.toFixed(2)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Costo:</span>
              <p className="font-semibold">${parseFloat(formData.cost || 0).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Precio:</span>
              <p className="font-semibold">${parseFloat(formData.price || 0).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Utilidad:</span>
              <p className="font-semibold">${(parseFloat(formData.price || 0) - parseFloat(formData.cost || 0)).toLocaleString()}</p>
            </div>
          </div>
          {profitMargin < 10 && (
            <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-xs">
                <strong>¡Atención!</strong> Margen de utilidad muy bajo. Considere revisar el precio de venta.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange} />
      </div>
    </div>
  );
};

export default ProductFormGeneral;