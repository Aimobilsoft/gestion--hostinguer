import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, Search, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Accounting = ({ accountingEntries, formatCurrency }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const getTypeColor = (type) => {
    switch (type) {
      case 'FV': return 'bg-green-500';
      case 'AF': return 'bg-red-500';
      case 'DC': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'FV': return 'Factura de Venta';
      case 'AF': return 'Anulación de Factura';
      case 'DC': return 'Devolución de Cliente';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Calculator className="mr-3" />
            Módulo de Contabilidad
          </h2>
          <p className="text-gray-300 mt-1">Comprobantes contables generados automáticamente</p>
        </div>
      </div>

      <Card className="invoice-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar comprobantes..." className="pl-10" />
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
                <th className="text-left py-3 px-4 font-semibold">Comprobante</th>
                <th className="text-left py-3 px-4 font-semibold">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold">Documento</th>
                <th className="text-left py-3 px-4 font-semibold">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold">Total</th>
                <th className="text-left py-3 px-4 font-semibold">Estado</th>
                <th className="text-center py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accountingEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{entry.id}</td>
                  <td className="py-3 px-4">
                    <Badge className={`${getTypeColor(entry.type)} text-white`}>
                      {entry.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{entry.documentId}</td>
                  <td className="py-3 px-4">{entry.date}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{entry.description}</td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(entry.total)}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-500 text-white">{entry.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl invoice-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
              Detalle del Comprobante {selectedEntry?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo de Movimiento</p>
                  <p className="font-semibold">{getTypeName(selectedEntry.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documento Origen</p>
                  <p className="font-semibold">{selectedEntry.documentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold">{selectedEntry.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-lg">{formatCurrency(selectedEntry.total)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Descripción</p>
                <p className="font-medium">{selectedEntry.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Asientos Contables
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-semibold">Cuenta</th>
                        <th className="text-left py-2 px-3 font-semibold">Nombre de la Cuenta</th>
                        <th className="text-right py-2 px-3 font-semibold">Débito</th>
                        <th className="text-right py-2 px-3 font-semibold">Crédito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEntry.entries.map((entry, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-2 px-3 font-mono">{entry.account}</td>
                          <td className="py-2 px-3">{entry.accountName}</td>
                          <td className="py-2 px-3 text-right font-semibold">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                          </td>
                          <td className="py-2 px-3 text-right font-semibold">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan="2" className="py-2 px-3 font-bold">TOTALES</td>
                        <td className="py-2 px-3 text-right font-bold">
                          {formatCurrency(selectedEntry.entries.reduce((sum, e) => sum + e.debit, 0))}
                        </td>
                        <td className="py-2 px-3 text-right font-bold">
                          {formatCurrency(selectedEntry.entries.reduce((sum, e) => sum + e.credit, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounting;