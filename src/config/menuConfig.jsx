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
  UserCheck,
  Tags,
  ClipboardList,
  ClipboardCheck,
} from 'lucide-react';

export const menuConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: 'dashboard',
  },
  {
    id: 'inventario',
    label: 'Gestión de Inventarios',
    icon: <Warehouse className="h-5 w-5" />,
    subItems: [
      { id: 'inventory-catalogs', label: 'Catálogo de Inventario', path: 'inventory-catalogs', icon: <BookOpen className="h-4 w-4" /> },
      { id: 'products', label: 'Productos', path: 'products', icon: <Package className="h-4 w-4" /> },
      { id: 'inventory', label: 'Registrar Movimientos', path: 'inventory', icon: <BookCopy className="h-4 w-4" /> },
      { id: 'inventory-physical-count', label: 'Toma Física de Inventario', path: 'inventory-physical-count', icon: <ClipboardList className="h-4 w-4" /> },
      { id: 'inventory-apply-count', label: 'Aplicación de Conteo', path: 'inventory-apply-count', icon: <ClipboardCheck className="h-4 w-4" /> },
    ],
  },
  {
    id: 'compras',
    label: 'Gestión de Compras',
    icon: <ShoppingCart className="h-5 w-5" />,
    subItems: [
      { id: 'purchasing-dashboard', label: 'Dashboard de Compras', path: 'purchasing', icon: <LayoutDashboard className="h-4 w-4" /> },
      { id: 'purchasing-catalogs', label: 'Catálogos de Compras', path: 'purchasing-catalogs', icon: <BookOpen className="h-4 w-4" /> },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas / Fact. Electrónica',
    icon: <ShoppingCart className="h-5 w-5" />,
    subItems: [
      { id: 'sales-dashboard', label: 'Dashboard de Ventas', path: 'sales-dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { id: 'clients', label: 'Clientes', path: 'clients', icon: <Users className="h-4 w-4" /> },
      { id: 'sellers', label: 'Vendedores', path: 'sellers', icon: <UserCheck className="h-4 w-4" /> },
      { id: 'price-lists', label: 'Listas de Precios', path: 'price-lists', icon: <Tags className="h-4 w-4" /> },
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