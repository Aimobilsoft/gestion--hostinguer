import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Building2, Warehouse, Settings, FileText, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TenantInfo from '@/components/saas/TenantInfo';

const Configuration = ({ 
  branches, warehouses, dianResolutions, currentBranch, currentWarehouse, 
  setCurrentBranch, setCurrentWarehouse,
  onBranchCreate, onBranchEdit, onBranchDelete,
  onWarehouseCreate, onWarehouseEdit, onWarehouseDelete,
  onResolutionCreate, onResolutionEdit, onResolutionDelete,
  getCurrentResolution
}) => {
  
  const currentBranchWarehouses = warehouses.filter(w => w.branchId === currentBranch?.id);
  const currentResolution = getCurrentResolution(currentBranch?.id, currentWarehouse?.id);

  const getResolutionStatus = (resolution) => {
    const today = new Date();
    const validFrom = new Date(resolution.validFrom);
    const validUntil = new Date(resolution.validUntil);
    
    if (!resolution.isActive) return 'inactive';
    if (today < validFrom) return 'pending';
    if (today > validUntil) return 'expired';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Vigente';
      case 'pending': return 'Pendiente';
      case 'expired': return 'Vencida';
      case 'inactive': return 'Inactiva';
      default: return 'Desconocido';
    }
  };

  const getDocumentTypeText = (type) => {
    switch (type) {
      case 'invoice': return 'Factura de Venta';
      case 'credit_note': return 'Nota de Crédito';
      case 'debit_note': return 'Nota de Débito';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Settings className="mr-3" />
            Configuración del Sistema
          </h2>
          <p className="text-gray-300 mt-1">Gestión de sedes, bodegas y resoluciones DIAN</p>
        </div>
      </div>

      <Card className="invoice-card p-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2" />
            Configuración Activa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-branch">Sede Activa</Label>
              <Select value={currentBranch?.id || ''} onValueChange={(value) => {
                const branch = branches.find(b => b.id === value);
                setCurrentBranch(branch);
                const branchWarehouses = warehouses.filter(w => w.branchId === value);
                if (branchWarehouses.length > 0) {
                  setCurrentWarehouse(branchWarehouses[0]);
                }
              }}>
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
              <Label htmlFor="current-warehouse">Bodega Activa</Label>
              <Select value={currentWarehouse?.id || ''} onValueChange={(value) => {
                const warehouse = warehouses.find(w => w.id === value);
                setCurrentWarehouse(warehouse);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una bodega" />
                </SelectTrigger>
                <SelectContent>
                  {currentBranchWarehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {currentResolution && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Resolución DIAN Vigente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Resolución:</span> {currentResolution.resolutionNumber}
                </div>
                <div>
                  <span className="font-medium">Prefijo:</span> {currentResolution.prefix}
                </div>
                <div>
                  <span className="font-medium">Próximo Número:</span> {currentResolution.prefix}-{String(currentResolution.currentNumber).padStart(3, '0')}
                </div>
                <div>
                  <span className="font-medium">Rango:</span> {currentResolution.rangeFrom} - {currentResolution.rangeTo}
                </div>
                <div>
                  <span className="font-medium">Válida hasta:</span> {new Date(currentResolution.validUntil).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Estado:</span>
                  <Badge className={`${getStatusColor(getResolutionStatus(currentResolution))} text-white`}>
                    {getStatusText(getResolutionStatus(currentResolution))}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {!currentResolution && currentBranch && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <p className="text-red-700">
                <strong>¡Atención!</strong> No hay resolución DIAN vigente para la configuración actual. 
                Es necesario crear una resolución para poder facturar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="branches" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branches">Sedes</TabsTrigger>
          <TabsTrigger value="warehouses">Bodegas</TabsTrigger>
          <TabsTrigger value="resolutions">Resoluciones DIAN</TabsTrigger>
          <TabsTrigger value="tenant">Info Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="branches" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Building2 className="mr-2" />
              Gestión de Sedes
            </h3>
            <Button onClick={onBranchCreate} className="colombia-gradient-alt text-white">
              <Plus className="w-4 h-4 mr-2" /> Nueva Sede
            </Button>
          </div>
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {branches.map(branch => (
              <motion.div key={branch.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="invoice-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{branch.name}</h4>
                          <Badge variant="secondary">{branch.code}</Badge>
                          {currentBranch?.id === branch.id && (
                            <Badge className="bg-green-500 text-white">Activa</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{branch.address}</p>
                        <p className="text-xs text-gray-500 mt-1">{branch.phone} • {branch.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="outline" onClick={() => onBranchEdit(branch)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => onBranchDelete(branch.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Warehouse className="mr-2" />
              Gestión de Bodegas
            </h3>
            <Button onClick={onWarehouseCreate} className="colombia-gradient-alt text-white">
              <Plus className="w-4 h-4 mr-2" /> Nueva Bodega
            </Button>
          </div>
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warehouses.map(warehouse => {
              const branch = branches.find(b => b.id === warehouse.branchId);
              return (
                <motion.div key={warehouse.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="invoice-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{warehouse.name}</h4>
                            <Badge variant="outline">{warehouse.code}</Badge>
                            {currentWarehouse?.id === warehouse.id && (
                              <Badge className="bg-green-500 text-white">Activa</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{warehouse.address}</p>
                          <p className="text-xs text-gray-500">
                            <strong>Sede:</strong> {branch?.name} • <strong>Responsable:</strong> {warehouse.manager}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="outline" onClick={() => onWarehouseEdit(warehouse)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => onWarehouseDelete(warehouse.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="resolutions" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center">
              <FileText className="mr-2" />
              Resoluciones DIAN
            </h3>
            <Button onClick={onResolutionCreate} className="colombia-gradient-alt text-white">
              <Plus className="w-4 h-4 mr-2" /> Nueva Resolución
            </Button>
          </div>
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dianResolutions.map((resolution, index) => {
              const branch = branches.find(b => b.id === resolution.branchId);
              const warehouse = warehouses.find(w => w.id === resolution.warehouseId);
              const status = getResolutionStatus(resolution);
              
              return (
                <motion.div 
                  key={resolution.id} 
                  layout 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="invoice-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Res. {resolution.resolutionNumber}</h4>
                            <Badge className={`${getStatusColor(status)} text-white`}>
                              {getStatusIcon(status)}
                              <span className="ml-1">{getStatusText(status)}</span>
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p><strong>Tipo:</strong> {getDocumentTypeText(resolution.documentType)}</p>
                            <p><strong>Prefijo:</strong> {resolution.prefix}</p>
                            <p><strong>Rango:</strong> {resolution.rangeFrom} - {resolution.rangeTo}</p>
                            <p><strong>Actual:</strong> {resolution.currentNumber}</p>
                            <p><strong>Sede:</strong> {branch?.name}</p>
                            {warehouse && <p><strong>Bodega:</strong> {warehouse.name}</p>}
                            <p><strong>Vigencia:</strong> {new Date(resolution.validFrom).toLocaleDateString()} - {new Date(resolution.validUntil).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="outline" onClick={() => onResolutionEdit(resolution)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => onResolutionDelete(resolution.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
          
          {dianResolutions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay resoluciones DIAN configuradas</h3>
              <p className="text-gray-500 mb-4">Cree su primera resolución DIAN para habilitar la facturación electrónica.</p>
              <Button onClick={onResolutionCreate} className="colombia-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Resolución
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="tenant" className="mt-6">
          <TenantInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuration;