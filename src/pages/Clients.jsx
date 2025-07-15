import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Edit, Power, PowerOff, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Clients = ({ clients, onCreate, onEdit, onToggleStatus }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Clientes</h2>
        <Button onClick={() => onCreate()} className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <Card className="invoice-card">
        <CardHeader>
          <CardTitle>Catálogo de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar clientes por nombre o NIT..." className="pl-10" />
            </div>
            <Button variant="outline" className="border-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold">NIT/Cédula</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Teléfono</th>
                  <th className="text-center py-3 px-4 font-semibold">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{client.name}</td>
                    <td className="py-3 px-4">{client.nit}</td>
                    <td className="py-3 px-4">{client.email}</td>
                    <td className="py-3 px-4">{client.phone}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {client.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(client)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={client.isActive ? 'destructive' : 'default'} 
                          onClick={() => onToggleStatus(client.id)}
                        >
                          {client.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {clients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay clientes registrados</h3>
              <p className="text-gray-500 mb-4">Cree su primer cliente para empezar a facturar.</p>
              <Button onClick={() => onCreate()} className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;