import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Plus, Search, ChevronDown, ChevronRight, Eye, Edit, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const InventoryMovements = ({ movements, warehouses, products, formatCurrency, onOpenForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  const getWarehouseName = (id) => warehouses.find(w => w.id === id)?.name || 'N/A';
  const getProductName = (id) => products.find(p => p.id === id)?.name || 'N/A';

  const groupedMovements = useMemo(() => {
    const filtered = movements.filter(m => 
      m.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.observation && m.observation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.id.toString().includes(searchTerm)
    );

    const groups = filtered.reduce((acc, movement) => {
      const date = new Date(movement.date).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(movement);
      return acc;
    }, {});

    return Object.entries(groups).map(([date, dateMovements]) => {
      const warehouseGroups = dateMovements.reduce((acc, movement) => {
        const warehouseId = movement.warehouseId;
        if (!acc[warehouseId]) {
          acc[warehouseId] = {
            warehouseName: getWarehouseName(warehouseId),
            movements: [],
            total: 0,
          };
        }
        acc[warehouseId].movements.push(movement);
        acc[warehouseId].total += movement.total;
        return acc;
      }, {});

      return {
        date,
        warehouseGroups: Object.values(warehouseGroups),
        total: dateMovements.reduce((sum, m) => sum + m.total, 0),
      };
    }).sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
  }, [movements, searchTerm, warehouses]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getMovementTypeBadge = (type) => {
    switch (type) {
      case 'entrada': return 'bg-green-100 text-green-800';
      case 'salida': return 'bg-red-100 text-red-800';
      case 'traslado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <ArrowRightLeft className="mr-3 h-8 w-8 text-gray-400" />
            Movimientos de Inventario
          </h2>
          <p className="text-muted-foreground mt-1">Historial de entradas, salidas y traslados.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card w-full md:w-64"
            />
          </div>
          <Button onClick={() => onOpenForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Movimiento
          </Button>
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-[100px] pl-4">Acciones</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>UND</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="pr-4">Observación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedMovements.map(dateGroup => (
                <React.Fragment key={dateGroup.date}>
                  {dateGroup.warehouseGroups.map(warehouseGroup => (
                    <React.Fragment key={`${dateGroup.date}-${warehouseGroup.warehouseName}`}>
                      <TableRow className="bg-gray-200 border-none hover:bg-gray-200 cursor-pointer" onClick={() => toggleGroup(`${dateGroup.date}-${warehouseGroup.warehouseName}`)}>
                        <TableCell colSpan={8} className="font-bold text-gray-700 py-2 pl-4">
                          <div className="flex items-center gap-2">
                            {expandedGroups[`${dateGroup.date}-${warehouseGroup.warehouseName}`] ? <ChevronDown /> : <ChevronRight />}
                            Almacen 01, Bodega: {warehouseGroup.warehouseName} -- Total ({warehouseGroup.movements.length})
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-gray-700 py-2 pr-4">
                          Total: {formatCurrency(warehouseGroup.total)}
                        </TableCell>
                      </TableRow>
                      {expandedGroups[`${dateGroup.date}-${warehouseGroup.warehouseName}`] && (
                        <TableRow className="bg-gray-100 border-none hover:bg-gray-100 cursor-pointer" onClick={() => toggleGroup(dateGroup.date)}>
                           <TableCell colSpan={8} className="font-semibold text-gray-600 py-1 pl-10">
                             <div className="flex items-center gap-2">
                               {expandedGroups[dateGroup.date] ? <ChevronDown /> : <ChevronRight />}
                               {dateGroup.date} -- Total ({warehouseGroup.movements.length})
                             </div>
                           </TableCell>
                           <TableCell className="text-right font-semibold text-gray-600 py-1 pr-4">
                             Total: {formatCurrency(warehouseGroup.total)}
                           </TableCell>
                        </TableRow>
                      )}
                      {expandedGroups[`${dateGroup.date}-${warehouseGroup.warehouseName}`] && expandedGroups[dateGroup.date] && warehouseGroup.movements.map(movement => (
                        <TableRow key={movement.id}>
                          <TableCell className="pl-16">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4 text-blue-500" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenForm(movement)}><Edit className="h-4 w-4 text-yellow-500" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Printer className="h-4 w-4 text-gray-500" /></Button>
                            </div>
                          </TableCell>
                          <TableCell>{movement.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('border-0 capitalize', getMovementTypeBadge(movement.type))}>
                              {movement.concept}
                            </Badge>
                          </TableCell>
                          <TableCell>{getProductName(movement.items[0].productId)}</TableCell>
                          <TableCell>UND</TableCell>
                          <TableCell>{movement.items[0].quantity}</TableCell>
                          <TableCell>{formatCurrency(movement.items[0].cost)}</TableCell>
                          <TableCell>{formatCurrency(movement.total)}</TableCell>
                          <TableCell className="pr-4">{movement.observation}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
              {groupedMovements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    <ArrowRightLeft className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron movimientos</h3>
                    <p>Intente ajustar la búsqueda o registre un nuevo movimiento.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InventoryMovements;