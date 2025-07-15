import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, FileWarning, Hash, Building2, Warehouse, Mail, Phone, User, Ban, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CreditNoteForm = ({ isOpen, onClose, onSave, invoice, getReturnableItems, formatCurrency, currentBranch, currentWarehouse, getCurrentResolution, mode = 'return' }) => {
  const [returnItems, setReturnItems] = useState([]);
  const [reason, setReason] = useState('');
  const isVoidMode = mode === 'void';

  const resolution = useMemo(() => getCurrentResolution(currentBranch?.id, currentWarehouse?.id, 'credit_note'), [currentBranch, currentWarehouse, getCurrentResolution]);
  
  useEffect(() => {
    if (invoice) {
      const returnable = getReturnableItems(invoice.id);
      if (isVoidMode) {
        setReturnItems(returnable.map(item => ({ ...item, returnQuantity: item.quantity })));
        setReason('Anulación de factura');
      } else {
        setReturnItems(returnable.map(item => ({ ...item, returnQuantity: 0 })));
        setReason('Devolución a Clientes');
      }
    }
  }, [invoice, isOpen, getReturnableItems, isVoidMode]);

  const handleQuantityChange = (productId, value) => {
    const newItems = [...returnItems];
    const itemIndex = newItems.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return;

    const maxQuantity = newItems[itemIndex].quantity;
    const newQuantity = Math.max(0, Math.min(Number(value) || 0, maxQuantity));
    
    newItems[itemIndex].returnQuantity = newQuantity;
    setReturnItems(newItems);
  };
  
  const calculateTotals = () => {
    const itemsToProcess = returnItems.filter(item => item.returnQuantity > 0);
    const subtotal = itemsToProcess.reduce((acc, item) => acc + (item.returnQuantity * item.price), 0);
    const totalTax = itemsToProcess.reduce((acc, item) => acc + (item.returnQuantity * item.price * (item.tax / 100)), 0);
    const total = subtotal + totalTax;
    return { subtotal, totalTax, total };
  };

  const { subtotal, totalTax, total } = calculateTotals();

  const handleSubmit = () => {
    const itemsForCreditNote = returnItems.filter(item => item.returnQuantity > 0);
    if (itemsForCreditNote.length > 0) {
      onSave(invoice, itemsForCreditNote, reason);
    }
    onClose();
  };

  const noItemsReturnable = returnItems.every(item => item.quantity === 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="bg-slate-800 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{isVoidMode ? 'Anular Factura' : 'Devoluciones de Mercancías y Servicios a Clientes'}</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-blue-800 px-2 py-1 rounded">
                <Hash className="w-4 h-4" />
                <span className="font-bold">
                  {resolution ? `${resolution.prefix}-${String(resolution.currentNumber).padStart(3, '0')}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-300 mt-2">
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4" />{currentBranch?.name || 'N/A'}</div>
            <div className="flex items-center gap-2"><Warehouse className="w-4 h-4" />{currentWarehouse?.name || 'N/A'}</div>
            {invoice?.issueDate && (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha Factura: {format(parseISO(invoice.issueDate), 'dd/MM/yyyy')}
                </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <Card className="bg-gray-50/50">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div><Label className="text-xs font-semibold text-gray-500">Cliente</Label><p className="font-medium">{invoice?.client?.name}</p></div>
                <div><Label className="text-xs font-semibold text-gray-500">Factura Original</Label><p className="font-medium">{invoice?.id}</p></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><p>{invoice?.client?.email || 'N/A'}</p></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><p>{invoice?.client?.phone || 'N/A'}</p></div>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><p>Vendedor: {invoice?.client?.assignedSalespersonId || 'N/A'}</p></div>
            </CardContent>
          </Card>

          {noItemsReturnable && !isVoidMode ? (
              <div className="flex flex-col items-center justify-center p-8 my-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <FileWarning className="w-16 h-16 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-semibold text-yellow-800">No hay artículos para devolver</h3>
                  <p className="text-sm text-yellow-700">Todos los productos de esta factura ya han sido devueltos.</p>
              </div>
          ) : (
              <div className="grid gap-6">
                <div className="space-y-2"><Label htmlFor="reason">Motivo de la Nota de Crédito</Label><Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} disabled={isVoidMode} /></div>
                <div className="rounded-lg border overflow-hidden"><table className="w-full text-sm">
                    <thead className="bg-gray-100"><tr>
                        <th className="text-left py-2 px-4 font-semibold">Producto</th>
                        <th className="text-center py-2 px-4 font-semibold">Unidad</th>
                        <th className="text-center py-2 px-4 font-semibold">Cant. Vendida</th>
                        <th className="text-right py-2 px-4 font-semibold">Precio Unit.</th>
                        <th className="text-center py-2 px-4 font-semibold">% IVA</th>
                        <th className="text-center py-2 px-4 font-semibold w-40">Cant. a Devolver</th>
                    </tr></thead>
                    <tbody>{returnItems.map(item => (<tr key={item.productId} className="border-t">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4 text-center">{item.unit}</td>
                        <td className="py-2 px-4 text-center">{item.quantity}</td>
                        <td className="py-2 px-4 text-right">{formatCurrency(item.price)}</td>
                        <td className="py-2 px-4 text-center">{item.tax}%</td>
                        <td className="py-2 px-4"><Input id={`return-${item.productId}`} type="number" className="w-24 mx-auto h-8 text-center" value={item.returnQuantity} onChange={(e) => handleQuantityChange(item.productId, e.target.value)} max={item.quantity} min="0" disabled={isVoidMode} /></td>
                    </tr>))}</tbody>
                </table></div>
                <div className="flex justify-end mt-4"><div className="w-full max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="text-gray-600">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-600">Total IVA</span><span className="font-medium">{formatCurrency(totalTax)}</span></div>
                    <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-lg"><span>Total Nota de Crédito</span><span>{formatCurrency(total)}</span></div>
                </div></div>
              </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={total === 0 || (noItemsReturnable && !isVoidMode)} className={isVoidMode ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>
            {isVoidMode ? <Ban className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            {isVoidMode ? 'Confirmar Anulación' : 'Generar Nota de Crédito'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditNoteForm;