import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProductFormAccounting = ({ 
  formData, 
  handleAccountingChange, 
  selectedCategory, 
  selectedLine 
}) => {
  return (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      {(selectedCategory?.accountingConfig || selectedLine?.accountingConfig) && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Herencia Contable:</strong> Este producto hereda las cuentas contables de su {selectedLine?.accountingConfig ? 'línea' : 'categoría'}. 
            Puede personalizar las cuentas específicas para este producto a continuación.
          </p>
        </div>
      )}
      
      <div>
        <h4 className="font-semibold mb-4 text-gray-700">Configuración Contable del Producto</h4>
        <p className="text-sm text-gray-600 mb-4">
          Personalice las cuentas contables de 8 dígitos para este producto. 
          Si se dejan vacías, se utilizarán las cuentas de la línea o categoría.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchaseAccount">Cuenta de Compra/Inventarios</Label>
            <Input 
              id="purchaseAccount" 
              value={formData.accountingConfig.purchaseAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 14350101"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="inventoryAccount">Cuenta de Inventario</Label>
            <Input 
              id="inventoryAccount" 
              value={formData.accountingConfig.inventoryAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 14350101"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="ivaGeneratedAccount">Cuenta IVA Generado</Label>
            <Input 
              id="ivaGeneratedAccount" 
              value={formData.accountingConfig.ivaGeneratedAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 24080101"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="retefuenteAccount">Cuenta ReteFuente</Label>
            <Input 
              id="retefuenteAccount" 
              value={formData.accountingConfig.retefuenteAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 23654001"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="reteicaAccount">Cuenta ReteICA</Label>
            <Input 
              id="reteicaAccount" 
              value={formData.accountingConfig.reteicaAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 23680101"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="incomeAccount">Cuenta de Ingreso</Label>
            <Input 
              id="incomeAccount" 
              value={formData.accountingConfig.incomeAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 41350101"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="costOfSalesAccount">Cuenta de Costo de Venta</Label>
            <Input 
              id="costOfSalesAccount" 
              value={formData.accountingConfig.costOfSalesAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 61350101"
              maxLength="8"
            />
          </div>
          <div>
            <Label htmlFor="inventoryWithdrawalAccount">Cuenta Retiro de Inventario</Label>
            <Input 
              id="inventoryWithdrawalAccount" 
              value={formData.accountingConfig.inventoryWithdrawalAccount} 
              onChange={handleAccountingChange}
              placeholder="Ej: 14350101"
              maxLength="8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormAccounting;