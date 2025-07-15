import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, User, FileText, Truck } from 'lucide-react';

const OrderDetailsModal = ({ 
  isOpen, 
  onClose, 
  order, 
  supplier, 
  formatCurrency 
}) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprobada': return 'bg-blue-500';
      case 'parcial': return 'bg-yellow-500';
      case 'completada': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (item) => {
    if (item.quantity === 0) return 0;
    return ((item.receivedQuantity || 0) / item.quantity) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl invoice-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Detalles de la Orden de Compra {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Order Header Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Orden:</strong> {order.id}</p>
                  <p><strong>Proveedor:</strong> {supplier?.name}</p>
                  <p><strong>NIT:</strong> {supplier?.nit}</p>
                  <p><strong>Contacto:</strong> {supplier?.contactPerson}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Fecha Orden:</strong> {order.orderDate}</p>
                  <p><strong>Fecha Esperada:</strong> {order.expectedDate}</p>
                  <p><strong>Estado:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(order.status)} text-white`}>
                      {order.status}
                    </Badge>
                  </p>
                  <p><strong>Aprobada por:</strong> {order.approvedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Productos en la Orden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Producto</th>
                      <th className="text-center py-2">Ordenado</th>
                      <th className="text-center py-2">Recibido</th>
                      <th className="text-center py-2">Pendiente</th>
                      <th className="text-right py-2">Costo Unit.</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-center py-2">Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">ID: {item.productId}</p>
                          </div>
                        </td>
                        <td className="py-3 text-center font-medium">{item.quantity}</td>
                        <td className="py-3 text-center text-green-600 font-medium">
                          {item.receivedQuantity || 0}
                        </td>
                        <td className="py-3 text-center text-orange-600 font-medium">
                          {item.pendingQuantity || item.quantity}
                        </td>
                        <td className="py-3 text-right">{formatCurrency(item.unitCost)}</td>
                        <td className="py-3 text-right font-semibold">
                          {formatCurrency(item.totalCost)}
                        </td>
                        <td className="py-3 text-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(item)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {getProgressPercentage(item).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Totals */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%):</span>
                      <span className="font-semibold">{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-yellow-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Observaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-yellow-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Approval Information */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Información de Aprobación
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Creada por:</strong> {order.createdBy}</p>
                  <p><strong>Aprobada por:</strong> {order.approvedBy}</p>
                </div>
                <div>
                  <p><strong>Fecha de Aprobación:</strong> {order.approvedDate}</p>
                  <p><strong>Plazo de Pago:</strong> {supplier?.paymentTerms} días</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;