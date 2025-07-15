import React, { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Printer, Ticket, FileText } from 'lucide-react';

const PrintDialog = ({ isOpen, onClose, componentRef, document }) => {
  const [printFormat, setPrintFormat] = useState('normal');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@page { size: ${printFormat === 'ticket' ? '80mm auto' : 'A4'}; margin: ${printFormat === 'ticket' ? '5mm' : '20mm'}; }`,
    onAfterPrint: onClose,
    documentTitle: `${document?.docType}-${document?.id}`
  });

  const triggerPrint = (format) => {
    setPrintFormat(format);
    setTimeout(handlePrint, 0); 
  };
  
  if (!isOpen || !document) return null;

  const getDetails = (doc) => {
    if (doc.docType === 'invoice') {
      return {
        title: 'Imprimir Factura de Venta',
        buttonText: 'Factura Normal (A4)'
      };
    }
    if (doc.docType === 'credit-note') {
      if (doc.reason === 'Anulación de factura') {
        return {
          title: 'Imprimir Anulación de Factura',
          buttonText: 'Anulación (A4)'
        };
      }
      return {
        title: 'Imprimir Devolución a Cliente',
        buttonText: 'Devolución (A4)'
      };
    }
    return {
      title: 'Imprimir Documento',
      buttonText: 'Documento (A4)'
    };
  };

  const details = getDetails(document);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Printer className="text-blue-500" />
            {details.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            El documento se ha generado correctamente. ¿En qué formato deseas imprimirlo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => triggerPrint('ticket')}>
            <Ticket className="w-8 h-8"/>
            <span className="font-semibold">Imprimir Ticket</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => triggerPrint('normal')}>
            <FileText className="w-8 h-8"/>
            <span className="font-semibold">{details.buttonText}</span>
          </Button>
        </AlertDialogFooter>
         <div className="mt-4">
          <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
         </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrintDialog;