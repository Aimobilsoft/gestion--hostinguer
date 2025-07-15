import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

const BranchForm = ({ isOpen, onClose, onSave, branch }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    dianResolution: '',
    invoicePrefix: 'FAC',
    creditNotePrefix: 'NC',
    invoiceRange: { from: 1, to: 1000 },
    creditNoteRange: { from: 1, to: 1000 },
    currentInvoiceNumber: 1,
    currentCreditNoteNumber: 1,
  });

  useEffect(() => {
    if (isOpen) {
      if (branch) {
        setFormData({
          ...branch,
          invoiceRange: branch.invoiceRange || { from: 1, to: 1000 },
          creditNoteRange: branch.creditNoteRange || { from: 1, to: 1000 }
        });
      } else {
        setFormData({
          name: '',
          code: '',
          address: '',
          phone: '',
          email: '',
          dianResolution: '',
          invoicePrefix: 'FAC',
          creditNotePrefix: 'NC',
          invoiceRange: { from: 1, to: 1000 },
          creditNoteRange: { from: 1, to: 1000 },
          currentInvoiceNumber: 1,
          currentCreditNoteNumber: 1,
        });
      }
    }
  }, [branch, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.includes('Range')) {
      const [rangeType, field] = id.split('Range');
      setFormData(prev => ({
        ...prev,
        [`${rangeType}Range`]: { 
          ...prev[`${rangeType}Range`], 
          [field]: parseInt(value) || 0 
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isEditing = !!branch;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl invoice-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold colombia-gradient text-transparent bg-clip-text">
            {isEditing ? 'Editar Sede' : 'Nueva Sede'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Actualice los detalles de la sede.' : 'Complete los detalles para crear una nueva sede.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre de la Sede</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={formData.code} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Textarea id="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="dianResolution">Resolución DIAN</Label>
            <Textarea id="dianResolution" value={formData.dianResolution} onChange={handleChange} placeholder="Res. DIAN N° 123456789 de 2025-01-01. Rango: FAC-001 a FAC-1000. Vigencia: 12 meses." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoicePrefix">Prefijo Facturas</Label>
              <Input id="invoicePrefix" value={formData.invoicePrefix} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="creditNotePrefix">Prefijo Notas de Crédito</Label>
              <Input id="creditNotePrefix" value={formData.creditNotePrefix} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <Label htmlFor="invoiceRangefrom">Rango Facturas - Desde</Label>
              <Input 
                id="invoiceRangefrom" 
                type="number" 
                value={formData.invoiceRange?.from || 1} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="invoiceRangeto">Hasta</Label>
              <Input 
                id="invoiceRangeto" 
                type="number" 
                value={formData.invoiceRange?.to || 1000} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="creditNoteRangefrom">Rango NC - Desde</Label>
              <Input 
                id="creditNoteRangefrom" 
                type="number" 
                value={formData.creditNoteRange?.from || 1} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="creditNoteRangeto">Hasta</Label>
              <Input 
                id="creditNoteRangeto" 
                type="number" 
                value={formData.creditNoteRange?.to || 1000} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" /> Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BranchForm;