import React, { useState, useMemo, useEffect } from 'react';
import { X, Save, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryMovementForm = ({ isOpen, onClose, onSave, movement, warehouses, products, formatCurrency, getNextMovementId }) => {
  const [movementType, setMovementType] = useState('ENTRADA');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [concept, setConcept] = useState('ENTRADA DE ALMACEN POR ORDEN');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [observation, setObservation] = useState('');
  const [consecutive, setConsecutive] = useState('');

  const isEditing = useMemo(() => !!movement, [movement]);

  useEffect(() => {
    if (isEditing && movement) {
      setMovementType(movement.type.toUpperCase());
      setDate(movement.date);
      setConcept(movement.concept);
      setWarehouseId(movement.warehouseId);
      setItems(movement.items.map(item => ({
        ...item,
        unitPrice: item.cost,
        total: item.total
      })));
      setObservation(movement.observation);
      setConsecutive(movement.id);
    } else {
      setMovementType('ENTRADA');
      setDate(new Date().toISOString().slice(0, 10));
      setConcept('ENTRADA DE ALMACEN POR ORDEN');
      setWarehouseId(warehouses[0]?.id || '');
      setItems([]);
      setObservation('');
      setConsecutive(getNextMovementId());
    }
  }, [isOpen, isEditing, movement, warehouses, getNextMovementId]);

  const handleAddItem = (product) => {
    if (!items.some(item => item.productId === product.id)) {
      setItems([...items, { 
        productId: product.id, 
        name: product.name, 
        code: product.code, 
        unit: 'UND',
        iva: 0,
        inventory: 0,
        quantity: 1, 
        unitPrice: product.cost,
        total: product.cost
      }]);
    }
    setSearchTerm('');
  };

  const handleItemChange = (productId, field, value) => {
    setItems(items.map(item => {
      if (item.productId === productId) {
        const newItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          newItem.total = (Number(newItem.quantity) || 0) * (Number(newItem.unitPrice) || 0);
        }
        return newItem;
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [searchTerm, products]);

  const subTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.total, 0);
  }, [items]);

  const totalIVA = 0;
  const total = subTotal + totalIVA;

  const handleSubmit = (e) => {
    e.preventDefault();
    const movementData = {
      id: consecutive,
      type: movementType.toLowerCase(),
      date,
      concept,
      warehouseId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        cost: item.unitPrice,
        total: item.total
      })),
      observation,
      subTotal,
      totalIVA,
      total,
    };
    
    if (onSave(movementData, isEditing)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        <header className="bg-cyan-500 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Editar Movimiento' : 'Registrar Movimiento'} de Productos
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-cyan-600">
            <X className="h-6 w-6" />
          </Button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4 text-cyan-600">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label>Bodega</Label>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo de movimiento</Label>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRADA">ENTRADA</SelectItem>
                    <SelectItem value="SALIDA">SALIDA</SelectItem>
                    <SelectItem value="TRASLADO">TRASLADO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Conceptos</Label>
                <Select value={concept} onValueChange={setConcept}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRADA DE ALMACEN POR ORDEN">ENTRADA DE ALMACEN POR ORDEN</SelectItem>
                    <SelectItem value="AJUSTE DE INVENTARIO">AJUSTE DE INVENTARIO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <Label>Consecutivo</Label>
                <Input type="text" value={consecutive} readOnly disabled />
              </div>
              <div className="flex items-center space-x-2">
                <Label>¿Requiere proveedor?</Label>
                <Switch />
                <span>NO</span>
              </div>
              <div>
                <Label>Nº remisión</Label>
                <Input type="text" />
              </div>
              <div>
                <Label>Nº factura</Label>
                <Input type="text" />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4 text-cyan-600">Seleccione los Productos</h3>
            <div className="bg-yellow-100 p-2 rounded-md mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nombre del Producto"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </PopoverTrigger>
                {searchTerm && (
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    {filteredProducts.length > 0 ? (
                      <ul className="py-1">
                        {filteredProducts.map(p => (
                          <li key={p.id} onClick={() => handleAddItem(p)} className="px-3 py-2 text-sm hover:bg-accent cursor-pointer">
                            {p.name} ({p.code})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground">No se encontraron productos.</p>
                    )}
                  </PopoverContent>
                )}
              </Popover>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-cyan-500 text-white">
                  <TableRow>
                    <TableHead className="text-white">Código</TableHead>
                    <TableHead className="text-white">Referencia</TableHead>
                    <TableHead className="text-white">Nombre Producto</TableHead>
                    <TableHead className="text-white">Und</TableHead>
                    <TableHead className="text-white">% IVA</TableHead>
                    <TableHead className="text-white">Cantidad</TableHead>
                    <TableHead className="text-white">Vlr. Unitario</TableHead>
                    <TableHead className="text-white">Total</TableHead>
                    <TableHead className="text-white"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.iva}</TableCell>
                      <TableCell>
                        <Input type="number" value={item.quantity} onChange={e => handleItemChange(item.productId, 'quantity', e.target.value)} className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.productId, 'unitPrice', e.target.value)} className="w-32 text-right" />
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Observación</Label>
              <Textarea value={observation} onChange={e => setObservation(e.target.value)} rows={4} />
            </div>
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4 text-cyan-600">Totales</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total I.V.A.</span>
                  <span className="font-semibold">{formatCurrency(totalIVA)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-2 rounded-b-lg">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} className="bg-cyan-500 hover:bg-cyan-600">Guardar</Button>
        </footer>
      </div>
    </div>
  );
};

export default InventoryMovementForm;