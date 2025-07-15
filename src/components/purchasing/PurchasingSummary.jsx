import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, Package, ShoppingCart } from 'lucide-react';

const PurchasingSummary = ({ 
  purchaseOrders, 
  suppliers, 
  supplierInvoices, 
  formatCurrency 
}) => {
  const activeOrders = purchaseOrders.filter(o => o.status !== 'completada' && o.status !== 'cancelada').length;
  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const pendingInvoices = supplierInvoices.filter(i => i.paymentStatus === 'pendiente').length;
  const totalPayable = supplierInvoices
    .filter(i => i.paymentStatus === 'pendiente')
    .reduce((sum, i) => sum + i.total, 0);

  const summaryCards = [
    {
      title: 'Órdenes Activas',
      value: activeOrders,
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      title: 'Proveedores',
      value: activeSuppliers,
      icon: Users,
      color: 'text-green-500'
    },
    {
      title: 'Facturas Pendientes',
      value: pendingInvoices,
      icon: Package,
      color: 'text-orange-500'
    },
    {
      title: 'Total por Pagar',
      value: formatCurrency(totalPayable),
      icon: ShoppingCart,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="invoice-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PurchasingSummary;