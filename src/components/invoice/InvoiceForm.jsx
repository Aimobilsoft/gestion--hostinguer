import React, { useState, useEffect, useMemo } from 'react';
import { X, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import InvoiceFormHeader from '@/components/invoice/form-sections/InvoiceFormHeader';
import InvoiceFormItems from '@/components/invoice/form-sections/InvoiceFormItems';
import InvoiceFormTotals from '@/components/invoice/form-sections/InvoiceFormTotals';
import ResolutionWarning from '@/components/invoice/form-sections/ResolutionWarning';

const InvoiceForm = ({ 
  isOpen, onClose, onSave, clients, products, paymentMethods, priceLists, formatCurrency, 
  currentBranch, currentWarehouse, getCurrentResolution, checkResolutionLimits,
  getProductStock, validateStock, onClientCreate
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [issueDate, setIssueDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [appliedAdvance, setAppliedAdvance] = useState(0);
  const [stockValidationErrors, setStockValidationErrors] = useState([]);
  const { toast } = useToast();

  const resolution = useMemo(() => getCurrentResolution(currentBranch?.id, currentWarehouse?.id, 'invoice'), [currentBranch, currentWarehouse, getCurrentResolution]);
  const resolutionStatus = useMemo(() => checkResolutionLimits(resolution), [resolution, checkResolutionLimits]);

  const resetForm = () => {
    setSelectedClient(null);
    setIssueDate(new Date());
    setItems([]);
    setNotes('');
    setSelectedPaymentMethod(null);
    setAppliedAdvance(0);
    setStockValidationErrors([]);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (items.length > 0 && currentWarehouse) {
      const errors = validateStock(items, currentWarehouse.id);
      setStockValidationErrors(errors);
    } else {
      setStockValidationErrors([]);
    }
  }, [items, currentWarehouse, validateStock]);

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const discountPercent = Number(item.discount) || 0;
        const itemTotal = quantity * price;
        const discountAmount = itemTotal * (discountPercent / 100);
        return acc + (itemTotal - discountAmount);
    }, 0);
    
    const totalDiscount = items.reduce((acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const discountPercent = Number(item.discount) || 0;
        return acc + (quantity * price * (discountPercent / 100));
    }, 0);

    const totalTax = items.reduce((acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const tax = Number(item.tax) || 0;
        const discountPercent = Number(item.discount) || 0;
        const base = (quantity * price) * (1 - discountPercent / 100);
        return acc + (base * (tax / 100));
    }, 0);

    const total = subtotal + totalTax;
    const netTotal = total - appliedAdvance;

    return { subtotal, totalTax, totalDiscount, total, netTotal };
  };

  const { subtotal, totalTax, totalDiscount, total, netTotal } = calculateTotals();

  const handleSubmit = () => {
    if (!resolutionStatus.isOk) {
      toast({ variant: 'destructive', title: 'Error de Resolución', description: 'No se puede facturar. Revise las alertas de resolución.' });
      return;
    }
    if (stockValidationErrors.length > 0) {
      toast({ variant: 'destructive', title: 'Error de Stock', description: 'No hay suficiente stock para uno o más productos.' });
      return;
    }

    const populatedItems = items.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId, 10));
        return { ...item, name: product ? product.name : 'N/A', requiresInventoryControl: product?.requiresInventoryControl || false };
    });
    
    const newInvoice = {
      client: selectedClient,
      issueDate: format(issueDate, 'yyyy-MM-dd'),
      dueDate: format(issueDate, 'yyyy-MM-dd'),
      items: populatedItems,
      notes,
      paymentMethod: paymentMethods.find(pm => pm.id === selectedPaymentMethod),
      appliedAdvance,
    };
    
    onSave(newInvoice);
  };

  const canSubmit = selectedClient && selectedPaymentMethod && items.length > 0 && 
                   items.every(i => i.productId) && resolutionStatus.isOk && stockValidationErrors.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-gray-50 flex flex-col">
        <InvoiceFormHeader
          onClose={onClose}
          onClientCreate={onClientCreate}
          issueDate={issueDate}
          resolution={resolution}
        />
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <ResolutionWarning resolutionStatus={resolutionStatus} />
          
          <InvoiceFormHeader.ClientInfo
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            clients={clients}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            paymentMethods={paymentMethods}
          />

          <InvoiceFormItems
            items={items}
            setItems={setItems}
            products={products}
            getProductStock={getProductStock}
            currentWarehouse={currentWarehouse}
            stockValidationErrors={stockValidationErrors}
            formatCurrency={formatCurrency}
            priceLists={priceLists}
            selectedClient={selectedClient}
          />

          <InvoiceFormTotals
            subtotal={subtotal}
            totalTax={totalTax}
            totalDiscount={totalDiscount}
            total={total}
            netTotal={netTotal}
            notes={notes}
            setNotes={setNotes}
            resolution={resolution}
            selectedClient={selectedClient}
            appliedAdvance={appliedAdvance}
            setAppliedAdvance={setAppliedAdvance}
            formatCurrency={formatCurrency}
          />
        </div>
        <div className="p-4 border-t bg-white flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            <FileText className="w-4 h-4 mr-2" />Salir
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            <DollarSign className="w-4 h-4 mr-2" />Facturar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm;