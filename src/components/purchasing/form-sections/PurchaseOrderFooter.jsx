import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DialogFooter } from '@/components/ui/dialog';
import { Save } from 'lucide-react';

const PurchaseOrderFooter = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onClose, 
  isEditing, 
  canSubmit 
}) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <>
      {/* Notes */}
      <div>
        <Label htmlFor="notes">Observaciones</Label>
        <Textarea 
          id="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          placeholder="Observaciones adicionales sobre la orden..."
          rows={3}
        />
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="font-medium">Estado:</span>
        <Badge className={`${formData.status === 'borrador' ? 'bg-gray-500' : 'bg-blue-500'} text-white`}>
          {formData.status}
        </Badge>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit}
        >
          <Save className="w-4 h-4 mr-2" /> 
          {isEditing ? 'Actualizar Orden' : 'Crear Orden'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default PurchaseOrderFooter;