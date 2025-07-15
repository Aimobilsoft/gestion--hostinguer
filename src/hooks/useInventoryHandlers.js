import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useInventoryHandlers = ({ addInventoryMovement, updateInventoryMovement }) => {
  const { toast } = useToast();
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);

  const handleOpenMovementForm = (movement = null) => {
    setEditingMovement(movement);
    setIsMovementFormOpen(true);
  };

  const handleCloseMovementForm = () => {
    setIsMovementFormOpen(false);
    setEditingMovement(null);
  };

  const handleSaveMovement = (movementData, isEditing) => {
    try {
      if (isEditing) {
        updateInventoryMovement(movementData);
        toast({
          title: '✅ Movimiento Actualizado',
          description: 'El movimiento de inventario ha sido actualizado correctamente.',
          variant: 'success',
        });
      } else {
        addInventoryMovement(movementData);
        toast({
          title: '✅ Movimiento Guardado',
          description: 'El movimiento de inventario ha sido registrado y el stock actualizado.',
          variant: 'success',
        });
      }
      handleCloseMovementForm();
      return true;
    } catch (error) {
      console.error('Error saving inventory movement:', error);
      toast({
        title: '❌ Error al Guardar',
        description: 'No se pudo registrar el movimiento de inventario.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    isMovementFormOpen,
    editingMovement,
    handleOpenMovementForm,
    handleCloseMovementForm,
    handleSaveMovement,
  };
};