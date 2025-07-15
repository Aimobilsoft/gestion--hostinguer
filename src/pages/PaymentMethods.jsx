import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, CreditCard, DollarSign, Smartphone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PaymentMethods = ({ paymentMethods, onCreate, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'efectivo': return <DollarSign className="w-5 h-5" />;
      case 'tarjeta_credito':
      case 'tarjeta_debito': return <CreditCard className="w-5 h-5" />;
      case 'transferencia': return <Building className="w-5 h-5" />;
      case 'cheque': return <Building className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'efectivo': return 'bg-green-100 text-green-600';
      case 'tarjeta_credito': return 'bg-blue-100 text-blue-600';
      case 'tarjeta_debito': return 'bg-purple-100 text-purple-600';
      case 'transferencia': return 'bg-orange-100 text-orange-600';
      case 'cheque': return 'bg-gray-100 text-gray-600';
      case 'credito': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeName = (type) => {
    const types = {
      'efectivo': 'Efectivo',
      'tarjeta_credito': 'Tarjeta de Crédito',
      'tarjeta_debito': 'Tarjeta de Débito',
      'transferencia': 'Transferencia Bancaria',
      'cheque': 'Cheque',
      'credito': 'Crédito',
      'otro': 'Otro'
    };
    return types[type] || 'Desconocido';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <CreditCard className="mr-3" />
            Formas de Pago
          </h2>
          <p className="text-gray-300 mt-1">Gestión de métodos de pago y configuración contable</p>
        </div>
        <Button onClick={() => onCreate()} className="colombia-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Forma de Pago
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((paymentMethod, index) => (
          <motion.div
            key={paymentMethod.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="invoice-card p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(paymentMethod.type)}`}>
                  {getTypeIcon(paymentMethod.type)}
                </div>
                <div className="text-right">
                  <Badge className={paymentMethod.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                    {paymentMethod.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{paymentMethod.code}</p>
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-2">{paymentMethod.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Tipo:</strong> {getTypeName(paymentMethod.type)}</p>
                  {paymentMethod.accountCode && (
                    <p><strong>Cuenta:</strong> {paymentMethod.accountCode} - {paymentMethod.accountName}</p>
                  )}
                  {paymentMethod.requiresReference && (
                    <p className="text-orange-600"><strong>Requiere referencia</strong></p>
                  )}
                  {paymentMethod.description && (
                    <p className="text-xs pt-2"><strong>Desc:</strong> {paymentMethod.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(paymentMethod)}>
                  <Edit className="w-4 h-4 mr-2" /> Editar
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => onDelete(paymentMethod.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay formas de pago configuradas</h3>
          <p className="text-gray-500 mb-4">Comience creando su primera forma de pago para habilitar la facturación.</p>
          <Button onClick={() => onCreate()} className="colombia-gradient text-white">
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Forma de Pago
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;