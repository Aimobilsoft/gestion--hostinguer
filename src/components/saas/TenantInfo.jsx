import React from 'react';
import { Building2, Database, Globe, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TenantInfo = () => {
  // Simulated tenant information - in a real SAAS this would come from context/API
  const tenantInfo = {
    id: 'tenant_12345',
    name: 'Mi Empresa S.A.S',
    subdomain: 'miempresa',
    plan: 'Professional',
    status: 'active',
    database: 'tenant_12345_db',
    region: 'Colombia',
    createdAt: '2025-01-15'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="invoice-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre de la Empresa</label>
              <p className="font-semibold">{tenantInfo.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">ID del Tenant</label>
              <p className="font-mono text-sm">{tenantInfo.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Plan</label>
              <Badge className="bg-blue-100 text-blue-800">{tenantInfo.plan}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estado</label>
              <Badge className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Activo
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="invoice-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Configuración de Acceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Subdominio</label>
              <p className="font-semibold">{tenantInfo.subdomain}.mobilfood.app</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">URL de Acceso</label>
              <p className="text-blue-600 font-mono text-sm">https://{tenantInfo.subdomain}.mobilfood.app</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Región</label>
              <p className="font-semibold">{tenantInfo.region}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
              <p className="font-semibold">{new Date(tenantInfo.createdAt).toLocaleDateString('es-CO')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="invoice-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Información de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 mb-2">Arquitectura Multi-Tenant</h4>
              <p className="text-blue-700 text-sm mb-3">
                Su aplicación utiliza una arquitectura SAAS con base de datos independiente por cliente (tenant), 
                garantizando total aislamiento y seguridad de sus datos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Base de Datos:</span>
                  <p className="font-mono">{tenantInfo.database}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Tipo:</span>
                  <p>PostgreSQL (Aislada)</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <h4 className="font-semibold text-green-800 mb-2">Compatibilidad con VPS Hostinger</h4>
              <p className="text-green-700 text-sm mb-3">
                <strong>¡Sí, puedes usar tu VPS de Hostinger!</strong> Tu aplicación SAAS es completamente compatible 
                con servidores VPS y puede configurarse para usar tu propia base de datos.
              </p>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>Opciones disponibles:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>PostgreSQL en tu VPS Hostinger</li>
                  <li>MySQL/MariaDB en tu servidor</li>
                  <li>Configuración de conexión personalizada</li>
                  <li>Migración de datos desde localStorage</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <h4 className="font-semibold text-yellow-800 mb-2">Estado Actual: Desarrollo</h4>
              <p className="text-yellow-700 text-sm">
                Actualmente usando localStorage para desarrollo. Para producción, se recomienda migrar a 
                una base de datos persistente (Supabase, tu VPS, o cualquier proveedor de base de datos).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantInfo;