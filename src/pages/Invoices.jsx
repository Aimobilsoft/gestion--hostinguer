import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Eye, Printer, Ban, Undo2, AlertTriangle, FileText, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const InvoicesTable = ({ invoices = [], onViewDocument, onReprintDocument, onReturn, onVoid, canVoidInvoice, formatCurrency, getStatusColor, getDianStatusColor }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-semibold">Número</th>
          <th className="text-left py-3 px-4 font-semibold">Cliente</th>
          <th className="text-left py-3 px-4 font-semibold">Fecha</th>
          <th className="text-left py-3 px-4 font-semibold">Total</th>
          <th className="text-left py-3 px-4 font-semibold">Estado</th>
          <th className="text-left py-3 px-4 font-semibold">DIAN</th>
          <th className="text-center py-3 px-4 font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice, index) => (
          <motion.tr
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 px-4 font-medium">{invoice.id}</td>
            <td className="py-3 px-4">{invoice.client.name}</td>
            <td className="py-3 px-4">{invoice.issueDate}</td>
            <td className="py-3 px-4 font-semibold">{formatCurrency(invoice.total)}</td>
            <td className="py-3 px-4">
              <Badge className={`${getStatusColor(invoice.status)} text-white`}>{invoice.status}</Badge>
            </td>
            <td className="py-3 px-4">
              <Badge className={`${getDianStatusColor(invoice.dianStatus)} text-white`}>{invoice.dianStatus}</Badge>
            </td>
            <td className="py-3 px-4 text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" disabled={invoice.status === 'anulada'}>
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDocument(invoice, 'invoice')}>
                    <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReprintDocument(invoice, 'invoice')}>
                    <Printer className="mr-2 h-4 w-4" /> Reimprimir
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onReturn(invoice)} disabled={invoice.status === 'anulada'}>
                    <Undo2 className="mr-2 h-4 w-4" /> Devolución (Nota C.)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={`${canVoidInvoice(invoice) ? 'text-red-500 focus:text-red-500' : 'text-gray-400'}`} 
                    onClick={() => canVoidInvoice(invoice) ? onVoid(invoice) : null}
                    disabled={!canVoidInvoice(invoice)}
                  >
                    {canVoidInvoice(invoice) ? (
                      <>
                        <Ban className="mr-2 h-4 w-4" /> Anular Factura
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-2 h-4 w-4" /> Solo mismo día
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CreditNotesTable = ({ creditNotes = [], onViewDocument, onReprintDocument, formatCurrency, getDianStatusColor }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-semibold">Nota CR</th>
          <th className="text-left py-3 px-4 font-semibold">Factura Orig.</th>
          <th className="text-left py-3 px-4 font-semibold">Cliente</th>
          <th className="text-left py-3 px-4 font-semibold">Fecha</th>
          <th className="text-left py-3 px-4 font-semibold">Total</th>
          <th className="text-left py-3 px-4 font-semibold">DIAN</th>
          <th className="text-center py-3 px-4 font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {creditNotes.map((cn, index) => (
          <motion.tr
            key={cn.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 px-4 font-medium">{cn.id}</td>
            <td className="py-3 px-4">{cn.originalInvoiceId}</td>
            <td className="py-3 px-4">{cn.client.name}</td>
            <td className="py-3 px-4">{cn.issueDate}</td>
            <td className="py-3 px-4 font-semibold">{formatCurrency(cn.total)}</td>
            <td className="py-3 px-4">
              <Badge className={`${getDianStatusColor(cn.dianStatus)} text-white`}>{cn.dianStatus}</Badge>
            </td>
            <td className="py-3 px-4 text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDocument(cn, 'credit-note')}>
                    <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReprintDocument(cn, 'credit-note')}>
                    <Printer className="mr-2 h-4 w-4" /> Reimprimir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Invoices = ({ invoices, creditNotes, onCreate, onReprintDocument, onViewDocument, onVoid, onReturn, formatCurrency, getStatusColor, getDianStatusColor, canVoidInvoice, initialTab = 'invoices' }) => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "🚧 Funcionalidad no implementada",
      description: "¡Puedes solicitar esto en tu próximo prompt! 🚀",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard de Ventas</h2>
        <Button onClick={onCreate} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white pulse-glow">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/3">
          <TabsTrigger value="invoices"><FileText className="w-4 h-4 mr-2" />Facturas</TabsTrigger>
          <TabsTrigger value="credit-notes"><FileWarning className="w-4 h-4 mr-2" />Notas de Crédito</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card className="invoice-card mt-4">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar facturas..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
              <InvoicesTable {...{ invoices, onViewDocument, onReprintDocument, onReturn, onVoid, canVoidInvoice, formatCurrency, getStatusColor, getDianStatusColor }} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="credit-notes">
          <Card className="invoice-card mt-4">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar notas de crédito..." className="pl-10" />
                </div>
                <Button variant="outline" className="border-gray-300" onClick={handleAction}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
              <CreditNotesTable {...{ creditNotes, onViewDocument, onReprintDocument, formatCurrency, getDianStatusColor }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invoices;