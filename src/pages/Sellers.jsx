import React from 'react';
import { motion } from 'framer-motion';
import { Plus, UserCheck, Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Sellers = ({ sellers, onCreate, onEdit, onToggleStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Catálogo de Vendedores</h2>
        <Button onClick={() => onCreate()} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Vendedor
        </Button>
      </div>

      <Card className="invoice-card">
        <CardHeader>
          <CardTitle>Vendedores Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {sellers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Comisión (%)</th>
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller, index) => (
                    <motion.tr
                      key={seller.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{seller.id}</td>
                      <td className="py-3 px-4">{seller.name}</td>
                      <td className="py-3 px-4">{seller.email}</td>
                      <td className="py-3 px-4">{seller.commissionRate}</td>
                      <td className="py-3 px-4">
                        <Badge className={`${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {seller.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center flex items-center justify-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(seller)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={seller.isActive ? 'destructive' : 'default'} 
                          onClick={() => onToggleStatus(seller.id)}
                        >
                          {seller.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
              <UserCheck className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay vendedores registrados</h3>
              <p className="text-gray-500 mb-4">
                Empieza por añadir tu primer vendedor para asignarlo a las facturas.
              </p>
              <Button onClick={() => onCreate()} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Vendedor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Sellers;