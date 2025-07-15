import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Edit, AlertTriangle, Shield, CheckCircle, Sparkles, Search, ChevronDown, ChevronRight, Pencil, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const Products = ({ products, categories, productLines, onCreate, onEdit, onToggleStatus, formatCurrency, getProductStock, currentWarehouse, isNewProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  const groupedProducts = useMemo(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups = categories.map(category => {
      const categoryLines = productLines
        .filter(line => line.categoryId === category.id)
        .map(line => {
          const lineProducts = filtered.filter(p => p.lineId === line.id);
          if (lineProducts.length === 0 && searchTerm) return null;
          return {
            ...line,
            products: lineProducts,
            totalCost: lineProducts.reduce((sum, p) => sum + (p.cost || 0), 0),
          };
        })
        .filter(Boolean);

      if (categoryLines.length === 0 && searchTerm) return null;
      
      return {
        ...category,
        lines: categoryLines,
        totalProducts: categoryLines.reduce((sum, l) => sum + l.products.length, 0),
        totalCost: categoryLines.reduce((sum, l) => sum + l.totalCost, 0),
      };
    }).filter(Boolean);

    return groups;
  }, [products, categories, productLines, searchTerm]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };
  
  const getStockInfo = (productId, requiresInventoryControl) => {
    if (!currentWarehouse || !requiresInventoryControl) {
      return { stock: 'N/A', icon: <Shield className="w-4 h-4 text-gray-500" />, className: 'bg-gray-100 text-gray-600' };
    }
    
    const stock = getProductStock(productId, currentWarehouse.id);
    if (stock <= 0) return { stock, icon: <AlertTriangle className="w-4 h-4 text-red-600" />, className: 'bg-red-100 text-red-700' };
    if (stock <= 10) return { stock, icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />, className: 'bg-yellow-100 text-yellow-700' };
    
    return { stock, icon: <CheckCircle className="w-4 h-4 text-green-600" />, className: 'bg-green-100 text-green-700' };
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
            <Package className="mr-3 h-8 w-8 text-gray-400" />
            Tablero de Productos y Servicios
          </h2>
          <p className="text-muted-foreground mt-1">Catálogo agrupado por categoría y línea.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={() => onCreate()}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
            </Button>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card w-full md:w-1/3"
                />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-[120px] pl-4">Acciones</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Último Costo</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center pr-4">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedProducts.length > 0 ? groupedProducts.map(category => (
                <React.Fragment key={category.id}>
                  <TableRow className="bg-gray-200 border-none hover:bg-gray-200 cursor-pointer" onClick={() => toggleGroup(category.id)}>
                    <TableCell colSpan={3} className="font-bold text-lg text-gray-700 py-3 pl-4">
                      <div className="flex items-center gap-2">
                        {expandedGroups[category.id] ? <ChevronDown /> : <ChevronRight />}
                        {category.name} - Total ({category.totalProducts})
                      </div>
                    </TableCell>
                    <TableCell colSpan={3} className="text-right font-bold text-lg text-gray-700 py-3 pr-4">
                      Costo Total: {formatCurrency(category.totalCost)}
                    </TableCell>
                  </TableRow>
                  {expandedGroups[category.id] && category.lines.map(line => (
                    <React.Fragment key={line.id}>
                      <TableRow className="bg-gray-100 border-none hover:bg-gray-100 cursor-pointer" onClick={() => toggleGroup(line.id)}>
                        <TableCell className="pl-10 font-semibold text-gray-600 py-2" colSpan={3}>
                          <div className="flex items-center gap-2">
                            {expandedGroups[line.id] ? <ChevronDown /> : <ChevronRight />}
                            {line.name} - Total ({line.products.length})
                          </div>
                        </TableCell>
                        <TableCell colSpan={3} className="text-right font-semibold text-gray-600 py-2 pr-4">
                          Costo: {formatCurrency(line.totalCost)}
                        </TableCell>
                      </TableRow>
                      {expandedGroups[line.id] && line.products.map(product => {
                        const stockInfo = getStockInfo(product.id, product.requiresInventoryControl);
                        const isNew = isNewProduct(product.createdAt);
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="pl-16 py-2">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(product)}>
                                  <Pencil className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleStatus(product.id)}>
                                  <Power className={cn("h-4 w-4", product.status === 'active' ? 'text-green-500' : 'text-red-500')} />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="font-medium flex items-center">
                                {product.name}
                                {isNew && <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">Nuevo</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground py-2">{product.code}</TableCell>
                            <TableCell className="text-right py-2">{formatCurrency(product.cost)}</TableCell>
                            <TableCell className="text-center py-2">
                              <Badge variant="outline" className={cn('flex items-center justify-center gap-1 border-0 rounded-md', stockInfo.className)}>
                                {stockInfo.icon}
                                {stockInfo.stock}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center pr-4 py-2">
                              <Badge variant="outline" className={cn('rounded-md border-0', product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                {product.status === 'active' ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                    <p>Intente ajustar la búsqueda o cree un nuevo producto.</p>
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

export default Products;