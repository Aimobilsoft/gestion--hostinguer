import { useState, useCallback } from 'react';

const initialClients = [
  { id: 1, name: 'Empresa ABC S.A.S', nit: '900123456-7', email: 'facturacion@empresaabc.com', phone: '+57 1 234 5678', address: 'Calle 123 #45-67', city: 'Bogotá', taxRegime: 'RESPONSABLE DE IVA', mobile: '3101234567', assignedSalespersonId: 'VEND-01', priceListId: 'PL-01', creditLimit: 5000000, advances: 200000, isActive: true },
  { id: 2, name: 'Comercial XYZ Ltda', nit: '800987654-3', email: 'contabilidad@comercialxyz.com', phone: '+57 2 345 6789', address: 'Carrera 78 #90-12', city: 'Medellín', taxRegime: 'RESPONSABLE DE IVA', mobile: '3119876543', assignedSalespersonId: 'VEND-02', priceListId: 'PL-02', creditLimit: 0, advances: 0, isActive: true },
  { id: 3, name: 'Juan Pérez', nit: '12345678-9', email: 'juan.perez@email.com', phone: '+57 4 567 8901', address: 'Avenida Siempre Viva 742', city: 'Cali', taxRegime: 'NO RESPONSABLE DE IVA', mobile: '3123456789', assignedSalespersonId: 'VEND-01', priceListId: 'PL-01', creditLimit: 1000000, advances: 50000, isActive: true },
];

export const useClientsData = () => {
  const [clients, setClients] = useState(initialClients);

  const addClient = useCallback((clientData) => {
    const newClient = { ...clientData, id: crypto.randomUUID(), isActive: true };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  }, []);

  const updateClient = useCallback((clientId, updatedData) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updatedData } : c));
  }, []);

  const toggleClientStatus = useCallback((clientId) => {
    let updatedClient = null;
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        updatedClient = { ...c, isActive: !c.isActive };
        return updatedClient;
      }
      return c;
    }));
    return updatedClient;
  }, []);
  
  const applyAdvance = useCallback((clientId, amount) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return { ...c, advances: (c.advances || 0) - amount };
      }
      return c;
    }));
  }, []);

  const findClientByNit = useCallback((nit) => {
    return clients.find(c => c.nit === nit);
  }, [clients]);

  return { clients, addClient, updateClient, toggleClientStatus, applyAdvance, findClientByNit };
};