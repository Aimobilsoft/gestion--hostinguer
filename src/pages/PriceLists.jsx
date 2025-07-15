import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Tags, Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PriceLists = ({ priceLists, onCreate, onEdit, onToggleStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Listas de Precios</h2>
        <Button onClick={() => onCreate()} className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Lista de Precios
        </Button>
      </div>

      <Card className="invoice-card">
        <CardHeader>
          <CardTitle>Listas de Precios Activas</CardTitle>
        </CardHeader>
        <CardContent>
          {priceLists.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold">Estado</th>
                    <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {priceLists.map((list, index) => (
                    <motion.tr
                      key={list.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{list.id}</td>
                      <td className="py-3 px-4">{list.name}</td>
                      <td className="py-3 px-4">{list.description}</td>
                      <td className="py-3 px-4">
                        <Badge className={`${list.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {list.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center flex items-center justify-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(list)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={list.isActive ? 'destructive' : 'default'} 
                          onClick={() => onToggleStatus(list.id)}
                        >
                          {list.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
              <Tags className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay listas de precios creadas</h3>
              <p className="text-gray-500 mb-4">
                Crea diferentes listas de precios para tus clientes o eventos especiales.
              </p>
              <Button onClick={() => onCreate()} className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Lista de Precios
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PriceLists;