import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ResolutionForm = ({ isOpen, onClose, onSave, resolution, branches, warehouses }) => {
  const [formData, setFormData] = useState({
    resolutionNumber: '',
    resolutionDate: new Date(),
    validFrom: new Date(),
    validUntil: new Date(),
    branchId: '',
    warehouseId: '',
    documentType: 'invoice',
    prefix: '',
    rangeFrom: 1,
    rangeTo: 1000,
    currentNumber: 1,
    technicalKey: '',
    testSetId: '',
    isActive: true,
    description: ''
  });

  const [filteredWarehouses, setFilteredWarehouses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (resolution) {
        setFormData({
          ...resolution,
          resolutionDate: new Date(resolution.resolutionDate),
          validFrom: new Date(resolution.validFrom),
          validUntil: new Date(resolution.validUntil)
        });
        if (resolution.branchId) {
          setFilteredWarehouses(warehouses.filter(w => w.branchId === resolution.branchId));
        }
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        
        setFormData({
          resolutionNumber: '',
          resolutionDate: new Date(),
          validFrom: tomorrow,
          validUntil: nextYear,
          branchId: '',
          warehouseId: '',
          documentType: 'invoice',
          prefix: 'FAC',
          rangeFrom: 1,
          rangeTo: 1000,
          currentNumber: 1,
          technicalKey: '',
          testSetId: '',
          isActive: true,
          description: ''
        });
        setFilteredWarehouses([]);
      }
    }
  }, [resolution, isOpen, warehouses]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'branchId') {
      const branchWarehouses = warehouses.filter(w => w.branchId === value);
      setFilteredWarehouses(branchWarehouses);
      setFormData(prev => ({ ...prev, warehouseId: '' }));
    }
    
    if (field === 'documentType') {
      const prefixes = {
        'invoice': 'FAC',
        'credit_note': 'NC',
        'debit_note': 'ND'
      };
      setFormData(prev => ({ ...prev, prefix: prefixes[value] || 'FAC' }));
    }
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      resolutionDate: format(formData.resolutionDate, 'yyyy-MM-dd'),
      validFrom: format(formData.validFrom, 'yyyy-MM-dd'),
      validUntil: format(formData.validUntil, 'yyyy-MM-dd')
    };
    onSave(submitData);
  };

  const isEditing = !!resolution;
  const selectedBranch = branches.find(b => b.id === formData.branchId);
  const selectedWarehouse = warehouses.find(w => w.id === formData.warehouseId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Resolución DIAN' : 'Nueva Resolución DIAN'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles de la resolución DIAN.' : 'Complete los detalles para crear una nueva resolución DIAN.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resolutionNumber">Número de Resolución</Label>
              <Input 
                id="resolutionNumber" 
                value={formData.resolutionNumber} 
                onChange={handleChange}
                placeholder="Ej: 18764003688395"
              />
            </div>
            <div>
              <Label>Fecha de Resolución</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.resolutionDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.resolutionDate, 'dd/MM/yyyy', { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.resolutionDate} onSelect={(date) => handleDateChange('resolutionDate', date)} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Válida Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.validFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.validFrom, 'dd/MM/yyyy', { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.validFrom} onSelect={(date) => handleDateChange('validFrom', date)} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Válida Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.validUntil && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.validUntil, 'dd/MM/yyyy', { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.validUntil} onSelect={(date) => handleDateChange('validUntil', date)} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branchId">Sede</Label>
              <Select value={formData.branchId} onValueChange={(value) => handleSelectChange('branchId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una sede" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="warehouseId">Bodega (Opcional)</Label>
              <Select value={formData.warehouseId} onValueChange={(value) => handleSelectChange('warehouseId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una bodega" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las bodegas de la sede</SelectItem>
                  {filteredWarehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Select value={formData.documentType} onValueChange={(value) => handleSelectChange('documentType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Factura de Venta</SelectItem>
                  <SelectItem value="credit_note">Nota de Crédito</SelectItem>
                  <SelectItem value="debit_note">Nota de Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prefix">Prefijo</Label>
              <Input id="prefix" value={formData.prefix} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="isActive">Estado</Label>
              <Select value={formData.isActive ? 'true' : 'false'} onValueChange={(value) => handleSelectChange('isActive', value === 'true')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activa</SelectItem>
                  <SelectItem value="false">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rangeFrom">Rango Desde</Label>
              <Input id="rangeFrom" type="number" value={formData.rangeFrom} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="rangeTo">Rango Hasta</Label>
              <Input id="rangeTo" type="number" value={formData.rangeTo} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="currentNumber">Número Actual</Label>
              <Input id="currentNumber" type="number" value={formData.currentNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="technicalKey">Clave Técnica</Label>
              <Input id="technicalKey" value={formData.technicalKey} onChange={handleChange} placeholder="Clave técnica de la DIAN" />
            </div>
            <div>
              <Label htmlFor="testSetId">ID Set de Pruebas</Label>
              <Input id="testSetId" value={formData.testSetId} onChange={handleChange} placeholder="ID del set de pruebas" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Descripción adicional de la resolución"
            />
          </div>

          {selectedBranch && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Asignación:</strong> Esta resolución se aplicará a la sede "{selectedBranch.name}"
                {selectedWarehouse && ` y específicamente a la bodega "${selectedWarehouse.name}"`}
                {!selectedWarehouse && " y todas sus bodegas"}.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" /> Guardar Resolución
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionForm;