import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Edit, Users, Power, PowerOff } from 'lucide-react';

const SuppliersTab = ({ 
  suppliers, 
  onCreateSupplier, 
  onEditSupplier, 
  onToggleStatusSupplier 
}) => {
  return (
    <Card className="invoice-card p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar proveedores..." className="pl-10" />
        </div>
        <Button variant="outline" className="border-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        <Button onClick={onCreateSupplier} className="colombia-gradient text-white">
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
                <Button size="sm" variant="outline" className="flex-1" onClick={() => onEditSupplier(supplier)}>
                  <Edit className="w-4 h-4 mr-2" /> Editar
                </Button>
                <Button 
                  size="sm" 
                  variant={supplier.isActive ? 'destructive' : 'default'} 
                  className="flex-1" 
                  onClick={() => onToggleStatusSupplier(supplier.id)}
                >
                  {supplier.isActive ? <PowerOff className="w-4 h-4 mr-2" /> : <Power className="w-4 h-4 mr-2" />}
                  {supplier.isActive ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default SuppliersTab;