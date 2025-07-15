import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  ShoppingCart,
  BookOpen,
  Warehouse,
  Settings,
  Database,
  CreditCard,
  BookCopy,
} from 'lucide-react';

export const menuConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: 'dashboard',
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: <ShoppingCart className="h-5 w-5" />,
    subItems: [
      { id: 'invoices', label: 'Facturas', path: 'invoices', icon: <FileText className="h-4 w-4" /> },
      { id: 'returns', label: 'Devoluciones', path: 'returns', icon: <FileText className="h-4 w-4" /> },
      { id: 'clients', label: 'Clientes', path: 'clients', icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    icon: <ShoppingCart className="h-5 w-5" />,
    subItems: [
      { id: 'purchasing-orders', label: 'Órdenes de Compra', path: 'purchasing-orders', icon: <FileText className="h-4 w-4" /> },
      { id: 'purchasing-entries', label: 'Entradas de Almacén', path: 'purchasing-entries', icon: <Warehouse className="h-4 w-4" /> },
      { id: 'purchasing-suppliers', label: 'Proveedores', path: 'purchasing-suppliers', icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: <Warehouse className="h-5 w-5" />,
    subItems: [
      { id: 'products', label: 'Productos', path: 'products', icon: <Package className="h-4 w-4" /> },
      { id: 'inventory', label: 'Movimientos', path: 'inventory', icon: <BookCopy className="h-4 w-4" /> },
      { id: 'catalogs', label: 'Catálogos', path: 'catalogs', icon: <BookOpen className="h-4 w-4" /> },
    ],
  },
  {
    id: 'contabilidad',
    label: 'Contabilidad',
    icon: <BookOpen className="h-5 w-5" />,
    subItems: [
      { id: 'accounting', label: 'Movimientos', path: 'accounting', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: <Settings className="h-5 w-5" />,
    subItems: [
      { id: 'configuration', label: 'General', path: 'configuration', icon: <Settings className="h-4 w-4" /> },
      { id: 'payment-methods', label: 'Formas de Pago', path: 'payment-methods', icon: <CreditCard className="h-4 w-4" /> },
      { id: 'tenant-info', label: 'Base de Datos', path: 'tenant-info', icon: <Database className="h-4 w-4" /> },
    ],
  },
];