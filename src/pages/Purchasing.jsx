import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Users, FileText, Package, Plus, Search, Filter, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const Purchasing = ({ 
  suppliers, purchaseOrders, warehouseEntries, supplierInvoices, supportDocuments,
  formatCurrency, currentBranch, currentWarehouse 
}) => {
  const [activeTab, setActiveTab] = useState('orders');
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "🚧 Funcionalidad no implementada",
      description: "¡Puedes solicitar esto en tu próximo prompt! 🚀",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrador': return 'bg-gray-500';
      case 'aprobada': return 'bg-blue-500';
      case 'parcial': return 'bg-yellow-500';
      case 'completada': return 'bg-green-500';
      case 'cancelada': return 'bg-red-500';
      case 'radicada': return 'bg-green-500';
      case 'pendiente': return 'bg-yellow-500';
      case 'pagada': return 'bg-green-500';
      case 'aprobado': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Proveedor Desconocido';
  };

  const getPurchaseOrderNumber = (orderId) => {
    const order = purchaseOrders.find(o => o.id === orderId);
    return order ? order.id : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ShoppingCart className="mr-3" />
            Módulo de Compras
          </h2>
          <p className="text-gray-300 mt-1">Gestión completa de adquisiciones y proveedores</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAction} className="colombia-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
          <Button onClick={() => setActiveTab('suppliers')} variant="outline" className="border-white/20 text-white">
            <Users className="w-4 h-4 mr-2" />
            Proveedores
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="invoice-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Órdenes Activas</p>
                <p className="text-2xl font-bold">{purchaseOrders.filter(o => o.status !== 'completada' && o.status !== 'cancelada').length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="invoice-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Proveedores</p>
                <p className="text-2xl font-bold">{suppliers.filter(s => s.isActive).length}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="invoice-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Facturas Pendientes</p>
                <p className="text-2xl font-bold">{supplierInvoices.filter(i => i.paymentStatus === 'pendiente').length}</p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="invoice-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total por Pagar</p>
                <p className="text-2xl font-bold">{formatCurrency(supplierInvoices.filter(i => i.paymentStatus === 'pendiente').reduce((sum, i) => sum + i.total, 0))}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 glass-effect border border-white/20">
          <TabsTrigger value="orders" className="data-[state=active]:bg-white/20 text-white">
            <FileText className="w-4 h-4 mr-2" />Órdenes de Compra
          </TabsTrigger>
          <TabsTrigger value="entries" className="data-[state=active]:bg-white/20 text-white">
            <Package className="w-4 h-4 mr-2" />Entradas Almacén
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-white/20 text-white">
            <FileText className="w-4 h-4 mr-2" />Facturas Proveedor
          </TabsTrigger>
          <TabsTrigger value="support" className="data-[state=active]:bg-white/20 text-white">
            <FileText className="w-4 h-4 mr-2" />Doc. Soporte
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="data-[state=active]:bg-white/20 text-white">
            <Users className="w-4 h-4 mr-2" />Proveedores
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="orders">
            <Card className="invoice-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar órdenes de compra..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button onClick={handleAction} className="colombia-gradient text-white">
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
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            {order.status === 'borrador' && (
                              <Button size="sm" variant="outline" onClick={handleAction}>
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
          </TabsContent>

          <TabsContent value="entries">
            <Card className="invoice-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar entradas de almacén..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button onClick={handleAction} className="colombia-gradient text-white">
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
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="invoice-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar facturas de proveedor..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button onClick={handleAction} className="colombia-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Radicar Factura
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Factura</th>
                      <th className="text-left py-3 px-4 font-semibold">Factura Proveedor</th>
                      <th className="text-left py-3 px-4 font-semibold">Proveedor</th>
                      <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold">Vencimiento</th>
                      <th className="text-right py-3 px-4 font-semibold">Total</th>
                      <th className="text-center py-3 px-4 font-semibold">Estado</th>
                      <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierInvoices.map((invoice, index) => (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{invoice.id}</td>
                        <td className="py-3 px-4">{invoice.supplierInvoiceNumber}</td>
                        <td className="py-3 px-4">{getSupplierName(invoice.supplierId)}</td>
                        <td className="py-3 px-4">{invoice.invoiceDate}</td>
                        <td className="py-3 px-4">{invoice.dueDate}</td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(invoice.total)}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${getStatusColor(invoice.paymentStatus)} text-white`}>
                            {invoice.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card className="invoice-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar documentos soporte..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button onClick={handleAction} className="colombia-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Documento
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Documento</th>
                      <th className="text-left py-3 px-4 font-semibold">Proveedor</th>
                      <th className="text-left py-3 px-4 font-semibold">Concepto</th>
                      <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                      <th className="text-right py-3 px-4 font-semibold">Total</th>
                      <th className="text-center py-3 px-4 font-semibold">Estado</th>
                      <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportDocuments.map((document, index) => (
                      <motion.tr
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{document.id}</td>
                        <td className="py-3 px-4">{getSupplierName(document.supplierId)}</td>
                        <td className="py-3 px-4">{document.concept}</td>
                        <td className="py-3 px-4">{document.documentDate}</td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(document.total)}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${getStatusColor(document.paymentStatus)} text-white`}>
                            {document.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleAction}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card className="invoice-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar proveedores..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button onClick={handleAction} className="colombia-gradient text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier, index) => (
                  <motion.div
                    key={supplier.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="invoice-card p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge className={`${supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {supplier.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg mb-2">{supplier.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p><strong>NIT:</strong> {supplier.nit}</p>
                          <p><strong>Contacto:</strong> {supplier.contactPerson}</p>
                          <p><strong>Teléfono:</strong> {supplier.phone}</p>
                          <p><strong>Email:</strong> {supplier.email}</p>
                          <p><strong>Plazo Pago:</strong> {supplier.paymentTerms} días</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={handleAction}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={handleAction}>
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Purchasing;