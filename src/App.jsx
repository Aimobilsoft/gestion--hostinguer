import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/pages/Dashboard';
import Invoices from '@/pages/Invoices';
import Clients from '@/pages/Clients';
import Products from '@/pages/Products';
import Catalogs from '@/pages/Catalogs';
import Accounting from '@/pages/Accounting';
import Configuration from '@/pages/Configuration';
import PaymentMethods from '@/pages/PaymentMethods';
import Inventory from '@/pages/Inventory';
import InventoryMovements from '@/pages/InventoryMovements';
import InventoryPhysicalCount from '@/pages/InventoryPhysicalCount';
import InventoryApplyCount from '@/pages/InventoryApplyCount';
import Purchasing from '@/pages/Purchasing';
import DatabaseSchema from '@/pages/DatabaseSchema';
import Sellers from '@/pages/Sellers';
import PriceLists from '@/pages/PriceLists';
import { useData } from '@/hooks/useData';
import { formatCurrency, getStatusColor, getDianStatusColor, isNewProduct } from '@/lib/helpers';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import InvoiceForm from '@/components/invoice/InvoiceForm';
import ClientForm from '@/components/client/ClientForm';
import ProductForm from '@/components/product/ProductForm';
import CreditNoteForm from '@/components/invoice/CreditNoteForm';
import CategoryForm from '@/components/product/CategoryForm';
import LineForm from '@/components/product/LineForm';
import BranchForm from '@/components/configuration/BranchForm';
import WarehouseForm from '@/components/configuration/WarehouseForm';
import ResolutionForm from '@/components/configuration/ResolutionForm';
import PaymentMethodForm from '@/components/payment/PaymentMethodForm';
import PurchaseOrderForm from '@/components/purchasing/PurchaseOrderForm';
import SupplierForm from '@/components/purchasing/SupplierForm';
import WarehouseEntryForm from '@/components/purchasing/WarehouseEntryForm';
import SellerForm from '@/components/sales/SellerForm';
import PriceListForm from '@/components/sales/PriceListForm';
import InventoryMovementForm from '@/components/inventory/InventoryMovementForm';

import InvoicePreview from '@/components/invoice/InvoicePreview';
import CreditNotePreview from '@/components/invoice/CreditNotePreview';
import PrintDialog from '@/components/invoice/PrintDialog';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

import { useInvoiceHandlers } from '@/hooks/useInvoiceHandlers';
import { useClientHandlers } from '@/hooks/useClientHandlers';
import { useProductHandlers } from '@/hooks/useProductHandlers';
import { useCatalogHandlers } from '@/hooks/useCatalogHandlers';
import { useConfigurationHandlers } from '@/hooks/useConfigurationHandlers';
import { usePurchasingHandlers } from '@/hooks/usePurchasingHandlers';
import { useSalesHandlers } from '@/hooks/useSalesHandlers';
import { useInventoryHandlers } from '@/hooks/useInventoryHandlers';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const data = useData();
  const { 
    invoices, clients, products, creditNotes, categories, productLines, branches, warehouses, dianResolutions, accountingEntries, paymentMethods, inventory, inventoryMovements,
    suppliers, purchaseOrders, warehouseEntries, supplierInvoices, supportDocuments,
    sellers, priceLists,
    addInvoice, addCreditNote,
    addClient, updateClient, toggleClientStatus,
    addProduct, updateProduct, toggleProductStatus, getNextProductCode,
    addCategory, updateCategory, deleteCategory, getNextCategoryId,
    addProductLine, updateProductLine, deleteProductLine,
    addBranch, updateBranch, deleteBranch,
    addWarehouse, updateWarehouse, deleteWarehouse,
    addDianResolution, updateDianResolution, deleteDianResolution,
    addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
    getReturnableItems, canVoidInvoice,
    currentBranch, currentWarehouse, setCurrentBranch, setCurrentWarehouse,
    getCurrentResolution, checkResolutionLimits,
    getProductStock, getProductCost, validateStock, calculateProfitMargin, getLowStockItems, getInventoryByWarehouse,
    addInventoryMovement, updateInventoryMovement, getNextMovementId,
    addSupplier, updateSupplier, toggleSupplierStatus, getSupplierById,
    addPurchaseOrder, updatePurchaseOrder, approvePurchaseOrder, getPurchaseOrderById, getApprovedPurchaseOrders, getPendingReceiptOrders, getNextPurchaseOrderId,
    addWarehouseEntry, getNextWarehouseEntryId,
    addSupplierInvoice, updateSupplierInvoice, getNextSupplierInvoiceId,
    addSupportDocument, updateSupportDocument, getNextSupportDocumentId,
    getAccountingEntryByDocId,
    addSeller, updateSeller, toggleSellerStatus,
    addPriceList, updatePriceList, togglePriceListStatus,
  } = data;

  const [confirmation, setConfirmation] = useState({ isOpen: false });
  const [viewingDocument, setViewingDocument] = useState(null);
  const { toast } = useToast();
  const printComponentRef = useRef();

  useEffect(() => {
    if (branches.length > 0 && !currentBranch) {
      setCurrentBranch(branches[0]);
    }
    if (warehouses.length > 0 && !currentWarehouse) {
      setCurrentWarehouse(warehouses[0]);
    }
  }, [branches, warehouses, currentBranch, currentWarehouse, setCurrentBranch, setCurrentWarehouse]);

  const invoiceHandlers = useInvoiceHandlers({
    addInvoice, addCreditNote, getReturnableItems, canVoidInvoice, toast,
    setDocumentForPreview: (document) => {
      setViewingDocument(document);
    },
    getAccountingEntryByDocId,
    currentBranch, currentWarehouse,
    setConfirmation
  });

  const clientHandlers = useClientHandlers({ addClient, updateClient, toggleClientStatus, toast, setConfirmation });
  const productHandlers = useProductHandlers({ addProduct, updateProduct, toggleProductStatus, toast, setConfirmation });
  const catalogHandlers = useCatalogHandlers({ addCategory, updateCategory, deleteCategory, addProductLine, updateProductLine, deleteProductLine, toast, setConfirmation });
  const configurationHandlers = useConfigurationHandlers({ addBranch, updateBranch, deleteBranch, addWarehouse, updateWarehouse, deleteWarehouse, addDianResolution, updateDianResolution, deleteDianResolution, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, toast, setConfirmation });
  const purchasingHandlers = usePurchasingHandlers({ addSupplier, updateSupplier, toggleSupplierStatus, addPurchaseOrder, updatePurchaseOrder, approvePurchaseOrder, addWarehouseEntry, toast, setConfirmation });
  const salesHandlers = useSalesHandlers({ addSeller, updateSeller, toggleSellerStatus, addPriceList, updatePriceList, togglePriceListStatus, toast, setConfirmation });
  const inventoryHandlers = useInventoryHandlers({ addInventoryMovement, updateInventoryMovement, toast });

  const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 } };
  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  const renderContent = () => {
    const purchasingTabMap = {
      'purchasing-orders': 'orders',
      'purchasing-entries': 'entries',
      'purchasing-invoices': 'invoices',
      'purchasing-support': 'support',
      'purchasing-catalogs': 'suppliers',
    };

    if (purchasingTabMap[activeTab]) {
      return <Purchasing 
        suppliers={suppliers} purchaseOrders={purchaseOrders} warehouseEntries={warehouseEntries} supplierInvoices={supplierInvoices} supportDocuments={supportDocuments} formatCurrency={formatCurrency} currentBranch={currentBranch} currentWarehouse={currentWarehouse} 
      />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard invoices={invoices} accountingEntries={accountingEntries} formatCurrency={formatCurrency} getStatusColor={getStatusColor}/>;
      case 'sales-dashboard':
        return <Invoices 
            invoices={invoices} 
            creditNotes={creditNotes} 
            onCreate={invoiceHandlers.handleCreateInvoice} 
            onReprintDocument={invoiceHandlers.handleReprintDocument} 
            onViewDocument={invoiceHandlers.handleViewDocument} 
            onVoid={invoiceHandlers.handleVoidInvoice} 
            onReturn={invoiceHandlers.handleOpenReturnForm} 
            formatCurrency={formatCurrency} 
            getStatusColor={getStatusColor} 
            getDianStatusColor={getDianStatusColor} 
            canVoidInvoice={canVoidInvoice} 
            initialTab={'invoices'}
        />;
      case 'clients': return <Clients clients={clients} onCreate={clientHandlers.handleOpenClientForm} onEdit={clientHandlers.handleOpenClientForm} onToggleStatus={clientHandlers.handleToggleClientStatus}/>;
      case 'sellers': return <Sellers sellers={sellers} onCreate={salesHandlers.handleOpenSellerForm} onEdit={salesHandlers.handleOpenSellerForm} onToggleStatus={salesHandlers.handleToggleSellerStatus} />;
      case 'price-lists': return <PriceLists priceLists={priceLists} onCreate={salesHandlers.handleOpenPriceListForm} onEdit={salesHandlers.handleOpenPriceListForm} onToggleStatus={salesHandlers.handleTogglePriceListStatus} />;
      case 'products': return <Products products={products} categories={categories} productLines={productLines} onCreate={productHandlers.handleOpenProductForm} onEdit={productHandlers.handleOpenProductForm} onToggleStatus={productHandlers.handleToggleProductStatus} formatCurrency={formatCurrency} getProductStock={getProductStock} currentWarehouse={currentWarehouse} isNewProduct={isNewProduct} />;
      case 'inventory': return <Inventory inventory={inventory} products={products} warehouses={warehouses} currentWarehouse={currentWarehouse} formatCurrency={formatCurrency} getLowStockItems={getLowStockItems} getInventoryByWarehouse={getInventoryByWarehouse} />;
      case 'inventory-movements': return <InventoryMovements movements={inventoryMovements} warehouses={warehouses} products={products} formatCurrency={formatCurrency} onOpenForm={inventoryHandlers.handleOpenMovementForm} />;
      case 'inventory-physical-count': return <InventoryPhysicalCount />;
      case 'inventory-apply-count': return <InventoryApplyCount />;
      case 'purchasing': return <Purchasing suppliers={suppliers} purchaseOrders={purchaseOrders} warehouseEntries={warehouseEntries} supplierInvoices={supplierInvoices} supportDocuments={supportDocuments} formatCurrency={formatCurrency} currentBranch={currentBranch} currentWarehouse={currentWarehouse} />;
      case 'inventory-catalogs': return <Catalogs categories={categories} productLines={productLines} onCategoryCreate={catalogHandlers.handleOpenCategoryForm} onCategoryEdit={catalogHandlers.handleOpenCategoryForm} onCategoryDelete={catalogHandlers.handleDeleteCategory} onLineCreate={catalogHandlers.handleOpenLineForm} onLineEdit={catalogHandlers.handleopenLineForm} onLineDelete={catalogHandlers.handleDeleteLine} />;
      case 'payment-methods': return <PaymentMethods paymentMethods={paymentMethods} onCreate={configurationHandlers.handleOpenPaymentMethodForm} onEdit={configurationHandlers.handleOpenPaymentMethodForm} onDelete={configurationHandlers.handleDeletePaymentMethod} />;
      case 'accounting': return <Accounting accountingEntries={accountingEntries} formatCurrency={formatCurrency} />;
      case 'configuration': return <Configuration branches={branches} warehouses={warehouses} dianResolutions={dianResolutions} currentBranch={currentBranch} currentWarehouse={currentWarehouse} setCurrentBranch={setCurrentBranch} setCurrentWarehouse={setCurrentWarehouse} onBranchCreate={configurationHandlers.handleOpenBranchForm} onBranchEdit={configurationHandlers.handleOpenBranchForm} onBranchDelete={configurationHandlers.handleDeleteBranch} onWarehouseCreate={configurationHandlers.handleOpenWarehouseForm} onWarehouseEdit={configurationHandlers.handleOpenWarehouseForm} onWarehouseDelete={configurationHandlers.handleDeleteWarehouse} onResolutionCreate={configurationHandlers.handleOpenResolutionForm} onResolutionEdit={configurationHandlers.handleOpenResolutionForm} onResolutionDelete={configurationHandlers.handleDeleteResolution} getCurrentResolution={getCurrentResolution} />;
      case 'tenant-info': return <DatabaseSchema />;
      default: return <Dashboard invoices={invoices} accountingEntries={accountingEntries} formatCurrency={formatCurrency} getStatusColor={getStatusColor}/>;
    }
  };

  const renderPreviewComponent = () => {
    if (!viewingDocument) return null;

    if (viewingDocument.docType === 'credit-note') {
      return <CreditNotePreview ref={printComponentRef} invoice={viewingDocument} formatCurrency={formatCurrency} />;
    }
    return <InvoicePreview ref={printComponentRef} invoice={viewingDocument} formatCurrency={formatCurrency} />;
  };

  return (
    <>
      <Helmet>
        <title>Mobilsoft Solutions - MobilFood ERP</title>
        <meta name="description" content="Plataforma ERP para la gestión de restaurantes y negocios de comida." />
      </Helmet>
      <div className="min-h-screen bg-background flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} onCreateInvoice={invoiceHandlers.handleCreateInvoice} />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
          <Header currentBranch={currentBranch} currentWarehouse={currentWarehouse} />
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="container mx-auto px-6 py-6">
            <motion.div initial="initial" animate="in" variants={pageVariants} transition={pageTransition}>{renderContent()}</motion.div>
          </motion.main>
        </div>
        
        <InvoiceForm 
          isOpen={invoiceHandlers.isInvoiceFormOpen} 
          onClose={() => invoiceHandlers.setIsInvoiceFormOpen(false)} 
          onSave={invoiceHandlers.handleSaveInvoice} 
          clients={clients} 
          products={products} 
          paymentMethods={paymentMethods}
          priceLists={priceLists}
          formatCurrency={formatCurrency} 
          currentBranch={currentBranch} 
          currentWarehouse={currentWarehouse} 
          getCurrentResolution={getCurrentResolution} 
          checkResolutionLimits={checkResolutionLimits} 
          getProductStock={getProductStock} 
          validateStock={validateStock} 
          onClientCreate={clientHandlers.handleOpenClientForm}
        />
        {invoiceHandlers.creditNoteFormState.isOpen && (
          <CreditNoteForm 
            isOpen={invoiceHandlers.creditNoteFormState.isOpen} 
            onClose={invoiceHandlers.handleCloseCreditNoteForm} 
            onSave={invoiceHandlers.handleSaveCreditNote} 
            invoice={invoiceHandlers.creditNoteFormState.invoice}
            mode={invoiceHandlers.creditNoteFormState.mode}
            getReturnableItems={getReturnableItems} 
            formatCurrency={formatCurrency}
            currentBranch={currentBranch}
            currentWarehouse={currentWarehouse}
            getCurrentResolution={getCurrentResolution}
          />
        )}
        <ClientForm 
          isOpen={clientHandlers.isClientFormOpen} 
          onClose={() => clientHandlers.setIsClientFormOpen(false)} 
          onSave={clientHandlers.handleSaveClient} 
          client={clientHandlers.editingClient} 
          sellers={sellers} 
          priceLists={priceLists} 
        />
        <ProductForm isOpen={productHandlers.isProductFormOpen} onClose={() => productHandlers.setIsProductFormOpen(false)} onSave={productHandlers.handleSaveProduct} product={productHandlers.editingProduct} categories={categories} productLines={productLines} getNextProductCode={getNextProductCode} calculateProfitMargin={calculateProfitMargin} currentWarehouse={currentWarehouse} />
        <CategoryForm isOpen={catalogHandlers.isCategoryFormOpen} onClose={() => catalogHandlers.setIsCategoryFormOpen(false)} onSave={catalogHandlers.handleSaveCategory} category={catalogHandlers.editingCategory} getNextCategoryId={getNextCategoryId} />
        <LineForm isOpen={catalogHandlers.isLineFormOpen} onClose={() => catalogHandlers.setIsLineFormOpen(false)} onSave={catalogHandlers.handleSaveLine} line={catalogHandlers.editingLine} categories={categories} />
        <BranchForm isOpen={configurationHandlers.isBranchFormOpen} onClose={() => configurationHandlers.setIsBranchFormOpen(false)} onSave={configurationHandlers.handleSaveBranch} branch={configurationHandlers.editingBranch} />
        <WarehouseForm isOpen={configurationHandlers.isWarehouseFormOpen} onClose={() => configurationHandlers.setIsWarehouseFormOpen(false)} onSave={configurationHandlers.handleSaveWarehouse} warehouse={configurationHandlers.editingWarehouse} branches={branches} />
        <ResolutionForm isOpen={configurationHandlers.isResolutionFormOpen} onClose={() => configurationHandlers.setIsResolutionFormOpen(false)} onSave={configurationHandlers.handleSaveResolution} resolution={configurationHandlers.editingResolution} branches={branches} warehouses={warehouses} />
        <PaymentMethodForm isOpen={configurationHandlers.isPaymentMethodFormOpen} onClose={() => configurationHandlers.setIsPaymentMethod(false)} onSave={configurationHandlers.handleSavePaymentMethod} paymentMethod={configurationHandlers.editingPaymentMethod} />
        <PurchaseOrderForm isOpen={purchasingHandlers.isPurchaseOrderFormOpen} onClose={() => purchasingHandlers.setIsPurchaseOrderFormOpen(false)} onSave={purchasingHandlers.handleSavePurchaseOrder} order={purchasingHandlers.editingPurchaseOrder} suppliers={suppliers} products={products} branches={branches} warehouses={warehouses} currentBranch={currentBranch} currentWarehouse={currentWarehouse} formatCurrency={formatCurrency} getNextPurchaseOrderId={getNextPurchaseOrderId} />
        <SupplierForm isOpen={purchasingHandlers.isSupplierFormOpen} onClose={() => purchasingHandlers.setIsSupplierFormOpen(false)} onSave={purchasingHandlers.handleSaveSupplier} supplier={purchasingHandlers.editingSupplier} />
        <WarehouseEntryForm isOpen={purchasingHandlers.isWarehouseEntryFormOpen} onClose={() => purchasingHandlers.setIsWarehouseEntryFormOpen(false)} onSave={purchasingHandlers.handleSaveWarehouseEntry} entry={purchasingHandlers.editingWarehouseEntry} purchaseOrders={getApprovedPurchaseOrders()} suppliers={suppliers} warehouses={warehouses} currentWarehouse={currentWarehouse} formatCurrency={formatCurrency} getNextWarehouseEntryId={getNextWarehouseEntryId} />
        <SellerForm isOpen={salesHandlers.isSellerFormOpen} onClose={() => salesHandlers.setIsSellerFormOpen(false)} onSave={salesHandlers.handleSaveSeller} seller={salesHandlers.editingSeller} />
        <PriceListForm isOpen={salesHandlers.isPriceListFormOpen} onClose={() => salesHandlers.setIsPriceListFormOpen(false)} onSave={salesHandlers.handleSavePriceList} priceList={salesHandlers.editingPriceList} products={products} formatCurrency={formatCurrency} />
        <InventoryMovementForm 
          isOpen={inventoryHandlers.isMovementFormOpen}
          onClose={inventoryHandlers.handleCloseMovementForm}
          onSave={inventoryHandlers.handleSaveMovement}
          movement={inventoryHandlers.editingMovement}
          warehouses={warehouses}
          products={products}
          formatCurrency={formatCurrency}
          getNextMovementId={getNextMovementId}
        />

        <PrintDialog isOpen={!!invoiceHandlers.documentToPrint} onClose={() => invoiceHandlers.setDocumentToPrint(null)} componentRef={printComponentRef} document={invoiceHandlers.documentToPrint} />
        
        <div style={{ display: 'none' }}>{renderPreviewComponent()}</div>

        <ConfirmationDialog isOpen={confirmation.isOpen} onClose={() => setConfirmation({ isOpen: false })} onConfirm={confirmation.onConfirm} title={confirmation.title} description={confirmation.description} />
        
        <Dialog open={!!viewingDocument && !invoiceHandlers.documentToPrint} onOpenChange={() => setViewingDocument(null)}>
            <DialogContent className="max-w-4xl p-0 border-0">
                {renderPreviewComponent()}
            </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </>
  );
}

export default App;