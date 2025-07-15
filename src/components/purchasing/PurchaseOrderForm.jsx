import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import PurchaseOrderHeader from '@/components/purchasing/form-sections/PurchaseOrderHeader';
import PurchaseOrderSupplierInfo from '@/components/purchasing/form-sections/PurchaseOrderSupplierInfo';
import PurchaseOrderItemsSection from '@/components/purchasing/form-sections/PurchaseOrderItemsSection';
import PurchaseOrderFooter from '@/components/purchasing/form-sections/PurchaseOrderFooter';

const PurchaseOrderForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  order, 
  suppliers, 
  products, 
  branches, 
  warehouses, 
  currentBranch, 
  currentWarehouse,
  formatCurrency,
  getNextPurchaseOrderId 
}) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    branchId: currentBranch?.id || '',
    warehouseId: currentWarehouse?.id || '',
    orderDate: format(new Date(), 'yyyy-MM-dd'),
    expectedDate: '',
    items: [],
    notes: '',
    status: 'borrador'
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
    unitCost: 0
  });

  useEffect(() => {
    if (isOpen) {
      if (order) {
        setFormData({
          ...order,
          orderDate: order.orderDate || format(new Date(), 'yyyy-MM-dd'),
          expectedDate: order.expectedDate || '',
          items: order.items || []
        });
      } else {
        setFormData({
          supplierId: '',
          branchId: currentBranch?.id || '',
          warehouseId: currentWarehouse?.id || '',
          orderDate: format(new Date(), 'yyyy-MM-dd'),
          expectedDate: '',
          items: [],
          notes: '',
          status: 'borrador'
        });
      }
      setNewItem({ productId: '', quantity: 1, unitCost: 0 });
    }
  }, [order, isOpen, currentBranch, currentWarehouse]);

  const calculateTotals = () => {
    if (!formData.items || !Array.isArray(formData.items)) {
      return { subtotal: 0, tax: 0, total: 0 };
    }
    
    const subtotal = formData.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = () => {
    if (!formData.supplierId || !formData.items || formData.items.length === 0) return;

    const { subtotal, tax, total } = calculateTotals();
    
    const orderData = {
      ...formData,
      subtotal,
      tax,
      total,
      orderDate: formData.orderDate,
      expectedDate: formData.expectedDate
    };

    onSave(orderData);
  };

  const isEditing = !!order;
  const { subtotal, tax, total } = calculateTotals();
  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl invoice-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles de la orden de compra.' : 'Complete los detalles para crear una nueva orden de compra.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <PurchaseOrderHeader 
            formData={formData}
            setFormData={setFormData}
            suppliers={suppliers}
            warehouses={warehouses}
          />

          {selectedSupplier && (
            <PurchaseOrderSupplierInfo supplier={selectedSupplier} />
          )}

          <PurchaseOrderItemsSection
            formData={formData}
            setFormData={setFormData}
            newItem={newItem}
            setNewItem={setNewItem}
            products={products}
            formatCurrency={formatCurrency}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />

          <PurchaseOrderFooter
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onClose={onClose}
            isEditing={isEditing}
            canSubmit={formData.supplierId && formData.items && formData.items.length > 0}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderForm;