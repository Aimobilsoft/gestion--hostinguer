import { useState } from 'react';

export const useInvoiceHandlers = ({
  addInvoice,
  addCreditNote,
  getReturnableItems,
  canVoidInvoice,
  toast,
  setDocumentForPreview,
  getAccountingEntryByDocId,
  currentBranch,
  currentWarehouse,
  setConfirmation
}) => {
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [creditNoteFormState, setCreditNoteFormState] = useState({ isOpen: false, invoice: null, mode: 'return' });
  const [documentToPrint, setDocumentToPrintState] = useState(null);

  const setDocumentForPrintDialog = (doc, docType) => {
    const accountingEntry = getAccountingEntryByDocId(doc.id);
    const documentToPrintData = { ...doc, docType, accountingEntry };
    setDocumentForPreview(documentToPrintData);
    setDocumentToPrintState(documentToPrintData);
  };

  const handleCreateInvoice = () => setIsInvoiceFormOpen(true);
  
  const handleSaveInvoice = (newInvoiceData) => {
    try {
      const invoiceWithContext = {
        ...newInvoiceData,
        currentBranch,
        currentWarehouse
      };
      const savedInvoice = addInvoice(invoiceWithContext);
      setDocumentForPrintDialog(savedInvoice, 'invoice');
      setIsInvoiceFormOpen(false);
      toast({ title: '¡Factura Creada! 🚀', description: `La factura ${savedInvoice.id} se está procesando con la DIAN.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error al crear factura', description: error.message });
    }
  };

  const handleReprintDocument = (doc, docType) => {
     setDocumentForPrintDialog(doc, docType);
  };

  const handleViewDocument = (doc, docType) => {
    const accountingEntry = getAccountingEntryByDocId(doc.id);
    const documentToView = { ...doc, docType, accountingEntry };
    setDocumentForPreview(documentToView);
  };
  
  const handleVoidInvoice = (invoice) => {
    if (!canVoidInvoice(invoice)) {
      toast({ variant: 'destructive', title: 'Error de Anulación', description: 'Solo se pueden anular facturas emitidas el mismo día.' });
      return;
    }
    setCreditNoteFormState({ isOpen: true, invoice: invoice, mode: 'void' });
  };

  const handleOpenReturnForm = (invoice) => {
    setCreditNoteFormState({ isOpen: true, invoice: invoice, mode: 'return' });
  };

  const handleCloseCreditNoteForm = () => {
    setCreditNoteFormState({ isOpen: false, invoice: null, mode: 'return' });
  };
  
  const handleSaveCreditNote = (originalInvoice, returnedItems, reason) => {
    try {
      const creditNote = addCreditNote(originalInvoice, returnedItems, reason);
      setDocumentForPrintDialog(creditNote, 'credit-note');
      const isVoiding = reason === 'Anulación de factura';
      toast({ 
        title: isVoiding ? 'Factura Anulada Correctamente' : 'Nota de Crédito Creada', 
        description: `Se generó la Nota de Crédito ${creditNote.id}.` 
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
    handleCloseCreditNoteForm();
  };

  return {
    isInvoiceFormOpen,
    setIsInvoiceFormOpen,
    creditNoteFormState,
    handleCloseCreditNoteForm,
    documentToPrint,
    setDocumentToPrint: setDocumentToPrintState,
    handleCreateInvoice,
    handleSaveInvoice,
    handleReprintDocument,
    handleViewDocument,
    handleVoidInvoice,
    handleOpenReturnForm,
    handleSaveCreditNote
  };
};