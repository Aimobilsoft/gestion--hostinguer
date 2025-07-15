import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Printer, FileDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const InventoryPhysicalCount = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "🚧 Funcionalidad no implementada",
      description: "¡Puedes solicitar esto en tu próximo prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ClipboardList className="mr-3 h-8 w-8" />
            Toma Física de Inventario
          </h2>
          <p className="text-gray-300 mt-1">
            Genere y gestione las plantillas para el conteo físico de productos.
          </p>
        </div>
        <Button onClick={handleAction} className="colombia-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Conteo
        </Button>
      </div>

      <Card className="bg-white/5 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Generar Plantilla de Conteo</CardTitle>
          <CardDescription className="text-gray-400">
            Seleccione los filtros para generar la plantilla que se usará en el conteo físico.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="warehouse" className="text-gray-300">Bodega</Label>
            <Select onValueChange={handleAction}>
              <SelectTrigger id="warehouse" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Seleccionar bodega..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Bodega Principal</SelectItem>
                <SelectItem value="secondary">Bodega Secundaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-300">Categoría de Producto</Label>
            <Select onValueChange={handleAction}>
              <SelectTrigger id="category" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="food">Alimentos</SelectItem>
                <SelectItem value="drinks">Bebidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="supplier" className="text-gray-300">Proveedor</Label>
            <Select onValueChange={handleAction}>
              <SelectTrigger id="supplier" className="bg-gray-900 border-gray-700">
                <SelectValue placeholder="Todos los proveedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="supplier1">Proveedor A</SelectItem>
                <SelectItem value="supplier2">Proveedor B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <div className="p-6 pt-0 flex justify-end space-x-3">
            <Button variant="outline" onClick={handleAction} className="border-gray-600 hover:bg-gray-700">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Plantilla
            </Button>
            <Button onClick={handleAction} className="colombia-gradient">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar a Excel
            </Button>
        </div>
      </Card>

      <Card className="bg-white/5 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Historial de Conteos</CardTitle>
          <CardDescription className="text-gray-400">
            Aquí aparecerán los conteos físicos que se han iniciado.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-10 text-gray-400">
                <p>No hay conteos registrados.</p>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InventoryPhysicalCount;