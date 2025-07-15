import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const Inventory = ({ 
  inventory, products, warehouses, currentWarehouse, formatCurrency,
  getLowStockItems, getInventoryByWarehouse
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(currentWarehouse?.id || 'all');
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "🚧 Funcionalidad no implementada",
      description: "¡Puedes solicitar esto en tu próximo prompt! 🚀",
    });
  };

  const warehouseInventory = selectedWarehouse && selectedWarehouse !== 'all' ? getInventoryByWarehouse(selectedWarehouse) : inventory;
  const lowStockItems = selectedWarehouse && selectedWarehouse !== 'all' ? getLowStockItems(selectedWarehouse) : [];

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Producto Desconocido';
  };

  const getProductCode = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.code : 'N/A';
  };

  const getStockStatus = (item) => {
    if (item.quantity <= 0) return { color: 'bg-red-100 text-red-800', text: 'Sin Stock', icon: <AlertTriangle className="w-4 h-4" /> };
    if (item.quantity <= item.minStock) return { color: 'bg-yellow-100 text-yellow-800', text: 'Stock Bajo', icon: <TrendingDown className="w-4 h-4" /> };
    if (item.quantity >= item.maxStock * 0.8) return { color: 'bg-blue-100 text-blue-800', text: 'Stock Alto', icon: <TrendingUp className="w-4 h-4" /> };
    return { color: 'bg-green-100 text-green-800', text: 'Stock Normal', icon: <Package className="w-4 h-4" /> };
  };

  const calculateInventoryValue = () => {
    return warehouseInventory.reduce((total, item) => total + (item.quantity * item.cost), 0);
  };

  const totalInventoryValue = calculateInventoryValue();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Package className="mr-3 h-8 w-8 text-gray-400" />
            Control de Inventario
          </h2>
          <p className="text-muted-foreground mt-1">Gestión de existencias y control de stock.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouseInventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {warehouseInventory.filter(item => item.quantity <= 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Bodega</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las bodegas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las bodegas</SelectItem>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 self-end">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar productos..." className="pl-10" />
            </div>
            <div className="self-end">
              <Button variant="outline" onClick={handleAction}>
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {lowStockItems.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-md">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Alerta de Stock Bajo</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    {lowStockItems.length} producto(s) tienen stock por debajo del mínimo establecido.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Código</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Producto</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Stock Actual</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Min/Max</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Costo Unit.</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Valor Total</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Estado</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {warehouseInventory.map((item, index) => {
                  const status = getStockStatus(item);
                  const totalValue = item.quantity * item.cost;
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 font-medium">{getProductCode(item.productId)}</td>
                      <td className="py-3 px-4">{getProductName(item.productId)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${item.quantity <= item.minStock ? 'text-yellow-600' : item.quantity <= 0 ? 'text-red-600' : ''}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground">
                        {item.minStock} / {item.maxStock}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.cost)}</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatCurrency(totalValue)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className={`${status.color} border-0`}>
                          <span className="flex items-center gap-1.5">
                            {status.icon}
                            {status.text}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAction}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAction}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {warehouseInventory.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay inventario disponible</h3>
              <p className="text-muted-foreground">
                {selectedWarehouse && selectedWarehouse !== 'all' ? 'No hay productos en la bodega seleccionada.' : 'No hay productos registrados en el inventario.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;