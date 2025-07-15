import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

const WarehouseEntryItems = ({ 
  formData, 
  formatCurrency,
  updateItemReceivedQuantity,
  updateItemCondition,
  updateItemNotes,
  subtotal,
  tax,
  total 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Productos a Recibir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Producto</th>
                <th className="text-center py-2">Ordenado</th>
                <th className="text-center py-2">Recibir</th>
                <th className="text-right py-2">Costo Unit.</th>
                <th className="text-center py-2">Condición</th>
                <th className="text-right py-2">Total</th>
                <th className="text-left py-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">ID: {item.productId}</p>
                    </div>
                  </td>
                  <td className="py-2 text-center font-medium">{item.orderedQuantity}</td>
                  <td className="py-2 text-center">
                    <Input 
                      type="number" 
                      min="0" 
                      max={item.orderedQuantity}
                      value={item.receivedQuantity} 
                      onChange={(e) => updateItemReceivedQuantity(index, e.target.value)}
                      className="w-20 text-center"
                    />
                  </td>
                  <td className="py-2 text-right">{formatCurrency(item.unitCost)}</td>
                  <td className="py-2 text-center">
                    <Select 
                      value={item.condition} 
                      onValueChange={(value) => updateItemCondition(index, value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bueno">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                            Bueno
                          </div>
                        </SelectItem>
                        <SelectItem value="regular">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                            Regular
                          </div>
                        </SelectItem>
                        <SelectItem value="malo">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                            Malo
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatCurrency(item.totalCost)}
                  </td>
                  <td className="py-2">
                    <Input 
                      value={item.notes} 
                      onChange={(e) => updateItemNotes(index, e.target.value)}
                      placeholder="Observaciones..."
                      className="w-32"
                    />
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
  );
};

export default WarehouseEntryItems;