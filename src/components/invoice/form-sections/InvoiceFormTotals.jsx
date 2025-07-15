import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InvoiceFormTotals = ({
  subtotal, totalTax, totalDiscount, total, netTotal,
  notes, setNotes, resolution,
  selectedClient, appliedAdvance, setAppliedAdvance, formatCurrency
}) => {

  const handleAdvanceChange = (e) => {
    const value = Number(e.target.value);
    const maxAdvance = selectedClient?.advances || 0;
    if (value >= 0 && value <= maxAdvance && value <= total) {
      setAppliedAdvance(value);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-3 space-y-4">
        <div>
          <Label className="text-xs font-medium">Observaciones</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm h-24 resize-none" placeholder="Observaciones adicionales..." />
        </div>
        <div>
          <Label className="text-xs font-medium">Resolución DIAN</Label>
          <div className="text-xs text-gray-600 mt-1 p-2 bg-gray-100 rounded border">
            {resolution ? `Autorización N°: ${resolution.resolutionNumber} de ${new Date(resolution.resolutionDate).toLocaleDateString()}. Vigente hasta ${new Date(resolution.validUntil).toLocaleDateString()}. Rango: ${resolution.prefix}-${resolution.rangeFrom} al ${resolution.prefix}-${resolution.rangeTo}.` : 'No hay resolución activa.'}
          </div>
        </div>
      </div>
      
      <div className="col-span-2">
        <Card className="bg-white">
          <CardHeader className="p-3 bg-gray-50 rounded-t-lg">
            <CardTitle className="text-lg">Resumen de Totales</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Descuentos:</span>
              <span className="font-medium text-red-600">-{formatCurrency(totalDiscount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total IVA:</span>
              <span className="font-medium">{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <span className="font-bold">Total Factura:</span>
              <span className="font-bold text-lg">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="appliedAdvance" className="text-gray-600">Anticipo:</Label>
              <Input 
                id="appliedAdvance"
                type="number" 
                value={appliedAdvance} 
                onChange={handleAdvanceChange} 
                className="w-32 h-8 text-right font-medium text-red-600" 
                disabled={!selectedClient || !selectedClient.advances > 0} 
              />
            </div>
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
              <span className="text-lg font-bold text-blue-700">Neto a Pagar:</span>
              <span className="text-2xl font-bold text-blue-700">{formatCurrency(netTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceFormTotals;