import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Calendar, User } from 'lucide-react';

const PendingOrdersBoard = ({ 
  pendingOrders, 
  suppliers, 
  formatCurrency, 
  onViewOrder, 
  onCreateEntry 
}) => {
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Proveedor Desconocido';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprobada': return 'bg-blue-500';
      case 'parcial': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPendingItemsCount = (order) => {
    return order.items.reduce((count, item) => count + (item.pendingQuantity || 0), 0);
  };

  return (
    <Card className="invoice-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center text-white">
          <Package className="w-6 h-6 mr-2" />
          Órdenes de Compra Pendientes de Recepción
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No hay órdenes pendientes de recepción</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-blue-800">{order.id}</h3>
                        <p className="text-sm text-gray-600">{getSupplierName(order.supplierId)}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Esperada: {order.expectedDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>Aprobada por: {order.approvedBy}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="w-4 h-4 mr-2" />
                        <span>Pendientes: {getPendingItemsCount(order)} unidades</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded p-3 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Total de la Orden:</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(order.total)}</p>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => onViewOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Orden Completa
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full colombia-gradient text-white"
                        onClick={() => onCreateEntry(order)}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Crear Entrada
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingOrdersBoard;