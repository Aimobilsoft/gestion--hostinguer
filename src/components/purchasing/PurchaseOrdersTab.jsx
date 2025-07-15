import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Eye, Edit, Check } from 'lucide-react';

const PurchaseOrdersTab = ({ 
  purchaseOrders, 
  suppliers, 
  formatCurrency, 
  onCreateOrder, 
  onEditOrder, 
  onApproveOrder, 
  onViewOrder 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'borrador': return 'bg-gray-500';
      case 'aprobada': return 'bg-blue-500';
      case 'parcial': return 'bg-yellow-500';
      case 'completada': return 'bg-green-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Proveedor Desconocido';
  };

  return (
    <Card className="invoice-card p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar órdenes de compra..." className="pl-10" />
        </div>
        <Button variant="outline" className="border-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        <Button onClick={onCreateOrder} className="colombia-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">Orden</th>
              <th className="text-left py-3 px-4 font-semibold">Proveedor</th>
              <th className="text-left py-3 px-4 font-semibold">Fecha</th>
              <th className="text-left py-3 px-4 font-semibold">Fecha Esperada</th>
              <th className="text-right py-3 px-4 font-semibold">Total</th>
              <th className="text-center py-3 px-4 font-semibold">Estado</th>
              <th className="text-center py-3 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{order.id}</td>
                <td className="py-3 px-4">{getSupplierName(order.supplierId)}</td>
                <td className="py-3 px-4">{order.orderDate}</td>
                <td className="py-3 px-4">{order.expectedDate}</td>
                <td className="py-3 px-4 text-right font-semibold">{formatCurrency(order.total)}</td>
                <td className="py-3 px-4 text-center">
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onViewOrder(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEditOrder(order)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {order.status === 'borrador' && (
                      <Button size="sm" variant="outline" onClick={() => onApproveOrder(order)}>
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PurchaseOrdersTab;