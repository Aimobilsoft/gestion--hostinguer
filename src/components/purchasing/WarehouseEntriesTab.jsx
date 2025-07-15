import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Eye, Edit, Package } from 'lucide-react';

// Import modular components
import PendingOrdersBoard from '@/components/purchasing/warehouse-entry/PendingOrdersBoard';
import OrderDetailsModal from '@/components/purchasing/warehouse-entry/OrderDetailsModal';

const WarehouseEntriesTab = ({ 
  warehouseEntries,
  purchaseOrders,
  suppliers, 
  formatCurrency, 
  onCreateEntry,
  onEditEntry,
  onViewEntry
}) => {
  const [viewingOrder, setViewingOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-500';
      case 'completada': return 'bg-green-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Proveedor Desconocido';
  };

  const pendingOrders = purchaseOrders.filter(order => 
    (order.status === 'aprobada' || order.status === 'parcial') && 
    order.items.some(item => (item.pendingQuantity || 0) > 0)
  );

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleCreateEntryFromOrder = (order) => {
    onCreateEntry(order);
  };

  const selectedSupplier = viewingOrder ? suppliers.find(s => s.id === viewingOrder.supplierId) : null;

  return (
    <div className="space-y-6">
      {/* Pending Orders Board */}
      <PendingOrdersBoard
        pendingOrders={pendingOrders}
        suppliers={suppliers}
        formatCurrency={formatCurrency}
        onViewOrder={handleViewOrder}
        onCreateEntry={handleCreateEntryFromOrder}
      />

      {/* Warehouse Entries List */}
      <Card className="invoice-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar entradas de almacén..." className="pl-10" />
          </div>
          <Button variant="outline" className="border-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => onCreateEntry()} className="colombia-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Entrada
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Entrada</th>
                <th className="text-left py-3 px-4 font-semibold">Orden Compra</th>
                <th className="text-left py-3 px-4 font-semibold">Proveedor</th>
                <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                <th className="text-right py-3 px-4 font-semibold">Total</th>
                <th className="text-center py-3 px-4 font-semibold">Estado</th>
                <th className="text-center py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {warehouseEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{entry.id}</td>
                  <td className="py-3 px-4">{entry.purchaseOrderId}</td>
                  <td className="py-3 px-4">{getSupplierName(entry.supplierId)}</td>
                  <td className="py-3 px-4">{entry.entryDate}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(entry.total)}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={`${getStatusColor(entry.status)} text-white`}>
                      {entry.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onViewEntry(entry)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEditEntry(entry)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {warehouseEntries.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No hay entradas de almacén registradas</p>
          </div>
        )}
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
        supplier={selectedSupplier}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default WarehouseEntriesTab;