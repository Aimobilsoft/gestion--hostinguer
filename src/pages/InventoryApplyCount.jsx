import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Upload, FileCheck2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const InventoryApplyCount = () => {
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
            <ClipboardCheck className="mr-3 h-8 w-8" />
            Aplicación de Conteo Físico
          </h2>
          <p className="text-gray-300 mt-1">
            Compare y aplique los conteos físicos para ajustar el stock del sistema.
          </p>
        </div>
      </div>

      <Card className="bg-white/5 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Cargar Archivo de Conteo</CardTitle>
          <CardDescription className="text-gray-400">
            Suba el archivo con los resultados de la toma física de inventario.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors">
          <Upload className="h-12 w-12 text-gray-500 mb-4" />
          <p className="text-lg font-semibold mb-2">Arrastre y suelte el archivo aquí</p>
          <p className="text-gray-400 mb-4">o</p>
          <Button onClick={handleAction} className="colombia-gradient">
            <FileCheck2 className="mr-2 h-4 w-4" />
            Seleccionar Archivo
          </Button>
          <p className="text-xs text-gray-500 mt-4">Formatos soportados: CSV, Excel</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Revisión y Aplicación</CardTitle>
          <CardDescription className="text-gray-400">
            Una vez cargado el archivo, podrá ver las diferencias y aplicar los ajustes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-gray-400">
            <p>Esperando archivo de conteo...</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-900/20 border-red-500/50 text-white">
        <CardHeader className="flex flex-row items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <div>
            <CardTitle className="text-red-400">¡Acción Crítica!</CardTitle>
            <CardDescription className="text-red-400/80">
              La aplicación de un conteo físico sobrescribirá las cantidades de stock actuales. Esta acción no se puede deshacer.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default InventoryApplyCount;