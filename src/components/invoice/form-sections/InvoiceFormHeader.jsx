import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, UserPlus, Calendar, Hash, X } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TopHeader = ({ onClose, onClientCreate, issueDate, resolution }) => (
  <div className="bg-slate-800 text-white p-2 flex justify-between items-center sticky top-0 z-10">
    <div className="flex items-center gap-4">
      <h2 className="text-lg font-bold">Factura de Venta</h2>
      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white h-7" onClick={onClientCreate}>
        <UserPlus className="w-4 h-4 mr-2" />
        Nuevo Cliente
      </Button>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>{format(issueDate, 'dd/MM/yyyy')}</span>
      </div>
      <div className="flex items-center gap-2 bg-blue-800 px-2 py-1 rounded">
        <Hash className="w-4 h-4" />
        <span className="font-bold">
          {resolution ? `${resolution.prefix}-${String(resolution.currentNumber).padStart(3, '0')}` : 'N/A'}
        </span>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700 h-7 w-7">
        <X className="w-5 h-5" />
      </Button>
    </div>
  </div>
);

const ClientInfo = ({
  selectedClient,
  setSelectedClient,
  clients,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentMethods,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const paymentMethodRef = useRef(null);

  const filteredClients = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowercasedQuery) ||
      client.nit.includes(searchQuery)
    ).slice(0, 10);
  }, [searchQuery, clients]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchQuery(client.name);
    setIsPopoverOpen(false);
    setTimeout(() => {
      paymentMethodRef.current?.focus();
    }, 100);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      setSelectedClient(null);
    }
  };

  useEffect(() => {
    if (selectedClient) {
      setSearchQuery(selectedClient.name);
    } else {
      setSearchQuery('');
    }
  }, [selectedClient]);

  const availablePaymentMethods = selectedClient?.creditLimit > 0
    ? paymentMethods.filter(pm => pm.isActive)
    : paymentMethods.filter(pm => pm.isActive && pm.type !== 'credito');

  return (
    <div className="p-3 bg-white border rounded-lg">
      <div className="grid grid-cols-12 gap-x-4 gap-y-1 text-sm">
        <div className="col-span-4">
          <Label className="text-xs font-medium">Nombre del Cliente</Label>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0 flex-shrink-0"><User className="w-4 h-4" /></Button>
                <Input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Buscar por nombre o NIT..."
                  className="bg-white text-xs h-7"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <div className="max-h-60 overflow-y-auto">
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="p-2 hover:bg-accent cursor-pointer text-xs"
                    >
                      <p className="font-medium">{client.name}</p>
                      <p className="text-muted-foreground">{client.nit}</p>
                    </div>
                  ))
                ) : (
                  searchQuery && <p className="p-4 text-center text-xs text-muted-foreground">No se encontraron clientes.</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="col-span-2">
          <Label className="text-xs font-medium">NIT</Label>
          <Input value={selectedClient?.nit || ''} readOnly className="bg-gray-100 text-xs h-7" />
        </div>
        <div className="col-span-2"><Label className="text-xs font-medium">Régimen</Label><Input value={selectedClient?.taxRegime || ''} readOnly className="bg-gray-100 text-xs h-7" /></div>
        <div className="col-span-2"><Label className="text-xs font-medium">Ciudad</Label><Input value={selectedClient?.city || ''} readOnly className="bg-gray-100 text-xs h-7" /></div>
        <div className="col-span-2"><Label className="text-xs font-medium">Teléfono</Label><Input value={selectedClient?.phone || ''} readOnly className="bg-gray-100 text-xs h-7" /></div>
        
        <div className="col-span-4"><Label className="text-xs font-medium">Dirección</Label><Input value={selectedClient?.address || ''} readOnly className="bg-gray-100 text-xs h-7" /></div>
        <div className="col-span-2">
          <Label className="text-xs font-medium">Forma Pago</Label>
          <Select onValueChange={setSelectedPaymentMethod} value={selectedPaymentMethod || ''} disabled={!selectedClient}>
            <SelectTrigger ref={paymentMethodRef} className="text-xs h-7"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{availablePaymentMethods.map(pm => (<SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="col-span-2"><Label className="text-xs font-medium">Vendedor</Label><Input value={selectedClient?.assignedSalespersonId || ''} readOnly className="bg-gray-100 text-xs h-7" /></div>
        <div className="col-span-2"><Label className="text-xs font-medium">Lista de Precios</Label><Input value={selectedClient?.priceListId || ''} readOnly className="bg-gray-100 text-xs h-7" /></div>
        <div className="col-span-2"><Label className="text-xs font-medium">Plazo-días</Label><Input value={selectedPaymentMethod === 'PM-003' ? '30' : '0'} readOnly className="bg-gray-100 text-xs h-7" /></div>
      </div>
    </div>
  );
};

const InvoiceFormHeader = (props) => <TopHeader {...props} />;
InvoiceFormHeader.ClientInfo = ClientInfo;

export default InvoiceFormHeader;