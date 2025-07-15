import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Package, Warehouse } from 'lucide-react';
import { format } from 'date-fns';

// Import modular components
import WarehouseEntryHeader from '@/components/purchasing/warehouse-entry/WarehouseEntryHeader';
import WarehouseEntryItems from '@/components/purchasing/warehouse-entry/WarehouseEntryItems';
import FileUploadSection from '@/components/purchasing/warehouse-entry/FileUploadSection';

const WarehouseEntryForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  entry, 
  purchaseOrders, 
  suppliers,
  warehouses,
  currentWarehouse,
  formatCurrency,
  getNextWarehouseEntryId 
}) => {
  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    supplierId: '',
    warehouseId: currentWarehouse?.id || '',
    entryDate: format(new Date(), 'yyyy-MM-dd'),
    items: [],
    notes: '',
    receivedBy: 'almacenista',
    attachments: []
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (entry) {
        // When editing, preserve all existing data including items
        setFormData({
          id: entry.id,
          purchaseOrderId: entry.purchaseOrderId || '',
          supplierId: entry.supplierId || '',
          warehouseId: entry.warehouseId || currentWarehouse?.id || '',
          entryDate: entry.entryDate || format(new Date(), 'yyyy-MM-dd'),
          items: entry.items || [],
          notes: entry.notes || '',
          receivedBy: entry.receivedBy || 'almacenista',
          attachments: entry.attachments || []
        });
        
        // Find and set the selected order
        const order = purchaseOrders.find(o => o.id === entry.purchaseOrderId);
        setSelectedOrder(order);
      } else {
        // When creating new entry, reset form
        setFormData({
          purchaseOrderId: '',
          supplierId: '',
          warehouseId: currentWarehouse?.id || '',
          entryDate: format(new Date(), 'yyyy-MM-dd'),
          items: [],
          notes: '',
          receivedBy: 'almacenista',
          attachments: []
        });
        setSelectedOrder(null);
      }
    }
  }, [entry, isOpen, currentWarehouse, purchaseOrders]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'purchaseOrderId') {
      const order = purchaseOrders.find(o => o.id === value);
      setSelectedOrder(order);
      
      if (order) {
        setFormData(prev => ({
          ...prev,
          supplierId: order.supplierId,
          items: order.items.map(item => ({
            productId: item.productId,
            name: item.name,
            orderedQuantity: item.quantity,
            receivedQuantity: item.quantity - (item.receivedQuantity || 0),
            unitCost: item.unitCost,
            totalCost: (item.quantity - (item.receivedQuantity || 0)) * item.unitCost,
            condition: 'bueno',
            notes: ''
          })).filter(item => item.receivedQuantity > 0)
        }));
      }
    }
  };

  const updateItemReceivedQuantity = (index, receivedQuantity) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              receivedQuantity: parseInt(receivedQuantity) || 0,
              totalCost: (parseInt(receivedQuantity) || 0) * item.unitCost
            }
          : item
      )
    }));
  };

  const updateItemCondition = (index, condition) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, condition } : item
      )
    }));
  };

  const updateItemNotes = (index, notes) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, notes } : item
      )
    }));
  };

  const handleAttachmentsChange = (newAttachments) => {
    setFormData(prev => ({ ...prev, attachments: newAttachments }));
  };

  const calculateTotals = () => {
    if (!formData.items || formData.items.length === 0) {
      return { subtotal: 0, tax: 0, total: 0 };
    }
    
    const subtotal = formData.items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = () => {
    // Validation: must have purchase order and at least one item
    if (!formData.purchaseOrderId) {
      return;
    }
    
    // For editing, allow submission even if items array is empty (might be a service entry)
    // For new entries, require at least one item
    if (!isEditing && (!formData.items || formData.items.length === 0)) {
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    
    const entryData = {
      ...formData,
      subtotal,
      tax,
      total,
      entryDate: formData.entryDate
    };

    onSave(entryData);
  };

  const isEditing = !!entry;
  const { subtotal, tax, total } = calculateTotals();
  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);
  
  // Filter pending orders for dropdown
  const pendingOrders = purchaseOrders.filter(order => 
    (order.status === 'aprobada' || order.status === 'parcial') && 
    order.items && order.items.some(item => (item.pendingQuantity || 0) > 0)
  );

  const nextEntryId = getNextWarehouseEntryId();
  const selectedWarehouse = warehouses.find(w => w.id === formData.warehouseId);

  // Improved validation for submit button
  const canSubmit = () => {
    // Must have purchase order
    if (!formData.purchaseOrderId) return false;
    
    // For editing: allow if we have an ID (existing entry)
    if (isEditing && formData.id) return true;
    
    // For new entries: require at least one item
    if (!isEditing && (!formData.items || formData.items.length === 0)) return false;
    
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl invoice-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text flex items-center">
                <Package className="w-6 h-6 mr-2" />
                {isEditing ? 'Editar Entrada de Almacén' : 'Nueva Entrada de Almacén'}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? 'Actualice los detalles de la entrada de almacén.' : 'Complete los detalles para registrar una nueva entrada de almacén.'}
              </DialogDescription>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-blue-700">{isEditing ? formData.id : nextEntryId}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Warehouse className="w-4 h-4 mr-1" />
                <span>{selectedWarehouse?.name || 'Seleccione bodega'}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Header Information */}
          <WarehouseEntryHeader
            formData={formData}
            setFormData={setFormData}
            pendingOrders={pendingOrders}
            suppliers={suppliers}
            warehouses={warehouses}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />

          {/* Order and Supplier Information */}
          {selectedOrder && selectedSupplier && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800">Información de la Orden</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Orden:</strong> {selectedOrder.id}</p>
                    <p><strong>Proveedor:</strong> {selectedSupplier.name}</p>
                    <p><strong>Fecha Orden:</strong> {selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <p><strong>Fecha Esperada:</strong> {selectedOrder.expectedDate}</p>
                    <p><strong>Estado:</strong> 
                      <Badge className={`ml-2 ${selectedOrder.status === 'aprobada' ? 'bg-blue-500' : 'bg-yellow-500'} text-white`}>
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p><strong>Total Orden:</strong> {formatCurrency(selectedOrder.total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items to Receive */}
          {formData.items && formData.items.length > 0 && (
            <WarehouseEntryItems
              formData={formData}
              formatCurrency={formatCurrency}
              updateItemReceivedQuantity={updateItemReceivedQuantity}
              updateItemCondition={updateItemCondition}
              updateItemNotes={updateItemNotes}
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
          )}

          {/* File Upload Section */}
          <FileUploadSection
            attachments={formData.attachments}
            onAttachmentsChange={handleAttachmentsChange}
          />

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receivedBy">Recibido por</Label>
              <Input 
                id="receivedBy" 
                value={formData.receivedBy} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="warehouseId">Bodega</Label>
              <Select value={formData.warehouseId} onValueChange={(value) => handleSelectChange('warehouseId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una bodega" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Observaciones Generales</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Observaciones generales sobre la entrada de almacén..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit()}
            className="colombia-gradient text-white"
          >
            <Save className="w-4 h-4 mr-2" /> 
            {isEditing ? 'Actualizar Entrada' : 'Registrar Entrada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseEntryForm;