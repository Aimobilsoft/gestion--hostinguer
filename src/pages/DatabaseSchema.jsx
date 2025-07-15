import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileCode, GitBranch, Server, CheckCircle, Key, Users, Building, Package, ShoppingCart, BookOpen, DollarSign } from 'lucide-react';

const modules = [
  {
    name: 'Configuración Maestra y SAAS',
    icon: <Key className="w-6 h-6 text-purple-600" />,
    tables: [
      {
        name: 'tenants',
        description: 'Información de la empresa (tenant) en la arquitectura SAAS.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único del tenant' },
          { name: 'name', type: 'string', description: 'Nombre de la empresa' },
          { name: 'nit', type: 'string', description: 'NIT de la empresa' },
          { name: 'subdomain', type: 'string', description: 'Subdominio de acceso (ej. miempresa)' },
          { name: 'plan', type: 'string', description: 'Plan SAAS contratado (ej. Professional)' },
        ],
      },
      {
        name: 'branches',
        description: 'Sedes o sucursales de la empresa.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único de la sede' },
          { name: 'tenant_id', type: 'uuid', fk: true, description: 'FK a tenants' },
          { name: 'name', type: 'string', description: 'Nombre de la sede' },
          { name: 'address', type: 'string', description: 'Dirección física' },
        ],
      },
      {
        name: 'warehouses',
        description: 'Bodegas de almacenamiento de inventario.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único de la bodega' },
          { name: 'branch_id', type: 'uuid', fk: true, description: 'FK a la sede a la que pertenece' },
          { name: 'name', type: 'string', description: 'Nombre de la bodega' },
        ],
      },
      {
        name: 'dian_resolutions',
        description: 'Resoluciones de facturación emitidas por la DIAN.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único de la resolución' },
          { name: 'prefix', type: 'string', description: 'Prefijo de facturación (ej. FEV)' },
          { name: 'range_from', type: 'integer', description: 'Número inicial del rango' },
          { name: 'range_to', type: 'integer', description: 'Número final del rango' },
          { name: 'valid_until', type: 'date', description: 'Fecha de vencimiento' },
        ],
      },
    ],
  },
  {
    name: 'Maestros de Transacción',
    icon: <Users className="w-6 h-6 text-blue-600" />,
    tables: [
      {
        name: 'clients',
        description: 'Maestro de clientes.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único del cliente' },
          { name: 'name', type: 'string', description: 'Nombre o Razón Social' },
          { name: 'nit', type: 'string', description: 'NIT o Cédula' },
          { name: 'price_list_id', type: 'uuid', fk: true, description: 'FK a listas de precios' },
        ],
      },
      {
        name: 'suppliers',
        description: 'Maestro de proveedores.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único del proveedor' },
          { name: 'name', type: 'string', description: 'Nombre o Razón Social' },
          { name: 'nit', type: 'string', description: 'NIT o Cédula' },
          { name: 'payable_account', type: 'string', description: 'Cuenta por pagar por defecto' },
        ],
      },
      {
        name: 'price_lists',
        description: 'Listas de precios para diferentes tipos de clientes.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único de la lista' },
          { name: 'name', type: 'string', description: 'Nombre de la lista (ej. Mayorista)' },
        ],
      },
    ],
  },
  {
    name: 'Módulo de Inventario',
    icon: <Package className="w-6 h-6 text-orange-600" />,
    tables: [
      {
        name: 'products',
        description: 'Catálogo de productos y servicios.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único del producto' },
          { name: 'name', type: 'string', description: 'Nombre del producto' },
          { name: 'line_id', type: 'uuid', fk: true, description: 'FK a líneas de producto' },
          { name: 'price', type: 'decimal', description: 'Precio de venta base' },
          { name: 'cost', type: 'decimal', description: 'Costo de adquisición' },
        ],
      },
      {
        name: 'categories',
        description: 'Categorías para agrupar líneas de productos.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único de la categoría' },
          { name: 'name', type: 'string', description: 'Nombre (ej. Hardware, Software)' },
          { name: 'income_account', type: 'string', description: 'Cuenta de ingreso por defecto' },
        ],
      },
      {
        name: 'product_lines',
        description: 'Líneas para clasificar productos dentro de categorías.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID único de la línea' },
          { name: 'category_id', type: 'uuid', fk: true, description: 'FK a categorías' },
          { name: 'name', type: 'string', description: 'Nombre (ej. Laptops, Servidores)' },
        ],
      },
      {
        name: 'inventory',
        description: 'Control de existencias por producto y bodega.',
        fields: [
          { name: 'product_id', type: 'uuid', pk: true, fk: true, description: 'FK a productos' },
          { name: 'warehouse_id', type: 'uuid', pk: true, fk: true, description: 'FK a bodegas' },
          { name: 'stock', type: 'integer', description: 'Cantidad disponible' },
        ],
      },
      {
        name: 'inventory_kardex',
        description: 'Histórico de todos los movimientos de inventario.',
        fields: [
          { name: 'id', type: 'bigint', pk: true, description: 'ID secuencial del movimiento' },
          { name: 'product_id', type: 'uuid', fk: true, description: 'FK a productos' },
          { name: 'warehouse_id', type: 'uuid', fk: true, description: 'FK a bodegas' },
          { name: 'date', type: 'timestamp', description: 'Fecha y hora del movimiento' },
          { name: 'type', type: 'string', description: 'Tipo (ENTRADA, SALIDA, AJUSTE)' },
          { name: 'quantity', type: 'integer', description: 'Cantidad del movimiento' },
          { name: 'balance', type: 'integer', description: 'Saldo resultante' },
          { name: 'document_id', type: 'string', description: 'ID del documento que origina (Factura, OC)' },
        ],
      },
    ],
  },
  {
    name: 'Módulo de Contabilidad',
    icon: <BookOpen className="w-6 h-6 text-cyan-600" />,
    tables: [
      {
        name: 'chart_of_accounts',
        description: 'Plan Único de Cuentas (PUC).',
        fields: [
          { name: 'code', type: 'string', pk: true, description: 'Código de la cuenta (ej. 110505)' },
          { name: 'name', type: 'string', description: 'Nombre de la cuenta (ej. Caja General)' },
          { name: 'type', type: 'string', description: 'Tipo (Activo, Pasivo, etc.)' },
        ],
      },
      {
        name: 'accounting_entries',
        description: 'Cabecera de los comprobantes contables.',
        fields: [
          { name: 'id', type: 'uuid', pk: true, description: 'ID del comprobante' },
          { name: 'date', type: 'date', description: 'Fecha del asiento' },
          { name: 'document_id', type: 'string', description: 'ID del documento origen' },
        ],
      },
      {
        name: 'accounting_entry_details',
        description: 'Movimientos de débito y crédito de cada asiento.',
        fields: [
          { name: 'id', type: 'bigint', pk: true, description: 'ID del movimiento' },
          { name: 'entry_id', type: 'uuid', fk: true, description: 'FK al comprobante' },
          { name: 'account_code', type: 'string', fk: true, description: 'FK al plan de cuentas' },
          { name: 'debit', type: 'decimal', description: 'Valor en el debe' },
          { name: 'credit', type: 'decimal', description: 'Valor en el haber' },
        ],
      },
    ],
  },
];

const SchemaTable = ({ table }) => (
  <Card className="mb-6 bg-white shadow-sm transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
        <FileCode className="w-5 h-5 text-primary" />
        {table.name}
      </CardTitle>
      <CardDescription>{table.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
            <thead>
                <tr className="border-b bg-slate-50">
                    <th className="p-2 text-left font-semibold">Campo</th>
                    <th className="p-2 text-left font-semibold">Tipo</th>
                    <th className="p-2 text-left font-semibold">Descripción</th>
                </tr>
            </thead>
            <tbody>
                {table.fields.map((field) => (
                <tr key={field.name} className="border-b last:border-b-0 hover:bg-slate-50">
                    <td className="p-2 font-mono flex items-center gap-2">
                        {field.name}
                        {field.pk && <Badge variant="destructive" className="px-1 py-0 text-xxs">PK</Badge>}
                        {field.fk && <Badge variant="outline" className="px-1 py-0 text-xxs border-blue-400 text-blue-500">FK</Badge>}
                    </td>
                    <td className="p-2"><Badge variant="secondary">{field.type}</Badge></td>
                    <td className="p-2 text-slate-600">{field.description}</td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const DatabaseSchema = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Modelo de Datos del Sistema</h2>
          <p className="text-muted-foreground">Arquitectura completa de la información para MobilFood ERP.</p>
        </div>
      </div>
      
      <Card className="bg-blue-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
              <Server className="w-5 h-5" />
              Plan de Migración a Producción
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-700">
           <p>
            ¡Excelente idea usar tu VPS de Hostinger! El sistema está preparado para ello. Este es el camino que seguiremos para pasar a producción de forma segura:
          </p>
          <ol className="flex flex-col md:flex-row gap-4 items-center">
             <li className="flex-1 text-center p-3 bg-white rounded-lg border shadow-sm">
                <p className="font-bold flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Paso 1: Desarrollo</p>
                <p className="text-xs">Usamos `localStorage` para máxima agilidad. (Estado actual)</p>
             </li>
             <li className="text-2xl text-blue-300 font-bold">&rarr;</li>
             <li className="flex-1 text-center p-3 bg-white rounded-lg border shadow-sm">
                <p className="font-bold">Paso 2: Conexión Estándar</p>
                <p className="text-xs">Integramos Supabase para instalar el conector PostgreSQL.</p>
             </li>
             <li className="text-2xl text-blue-300 font-bold">&rarr;</li>
             <li className="flex-1 text-center p-3 bg-white rounded-lg border shadow-sm">
                <p className="font-bold">Paso 3: Conexión a tu VPS</p>
                <p className="text-xs">Redirigimos la conexión a tu base de datos en Hostinger.</p>
             </li>
          </ol>
        </CardContent>
      </Card>

      {modules.map(module => (
        <div key={module.name}>
            <div className="flex items-center gap-3 mb-4">
              {module.icon}
              <h3 className="text-xl font-semibold text-slate-700">{module.name}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {module.tables.map((table) => (
                  <SchemaTable key={table.name} table={table} />
              ))}
            </div>
        </div>
      ))}
    </div>
  );
};

export default DatabaseSchema;