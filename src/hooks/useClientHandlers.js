import { useState, useCallback } from 'react';

export const useClientHandlers = ({
  addClient,
  updateClient,
  toggleClientStatus,
  toast,
  setConfirmation
}) => {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const handleOpenClientForm = useCallback((client = null) => { 
    setEditingClient(client); 
    setIsClientFormOpen(true); 
  }, []);

  const handleSaveClient = useCallback((clientData) => {
    if (editingClient) { 
      updateClient(editingClient.id, clientData); 
      toast({ title: 'Cliente Actualizado', description: 'Los datos del cliente se han guardado correctamente.' }); 
    } else { 
      addClient(clientData); 
      toast({ title: 'Cliente Creado', description: 'El nuevo cliente se ha añadido al sistema.' }); 
    }
    setIsClientFormOpen(false); 
    setEditingClient(null);
  }, [editingClient, addClient, updateClient, toast]);

  const handleToggleClientStatus = useCallback((clientId) => {
    const client = toggleClientStatus(clientId);
    const newStatus = client.isActive ? 'activado' : 'desactivado';
    const title = `Cliente ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
    toast({ title: title, description: `El cliente "${client.name}" ha sido ${newStatus}.` });
  }, [toggleClientStatus, toast]);

  return {
    isClientFormOpen,
    setIsClientFormOpen,
    editingClient,
    handleOpenClientForm,
    handleSaveClient,
    handleToggleClientStatus
  };
};