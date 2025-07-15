import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PurchaseOrderSupplierInfo = ({ supplier }) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-800">Información del Proveedor</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Contacto:</strong> {supplier.contactPerson}</p>
            <p><strong>Teléfono:</strong> {supplier.phone}</p>
          </div>
          <div>
            <p><strong>Email:</strong> {supplier.email}</p>
            <p><strong>Plazo de Pago:</strong> {supplier.paymentTerms} días</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderSupplierInfo;