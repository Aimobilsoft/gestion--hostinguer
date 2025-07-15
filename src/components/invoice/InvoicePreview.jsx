import React from 'react';
import { formatDate } from '@/lib/helpers';
import QRCode from '@/components/shared/QRCode';

const InvoicePreview = React.forwardRef(({ invoice, formatCurrency }, ref) => {
  if (!invoice) {
    return <div ref={ref}></div>;
  }
  
  const { id, client, issueDate, dueDate, items, subtotal, totalTax, retefuente, reteica, total, notes, dianResolution, cufe, dianResponse, originalInvoiceId, reason, accountingEntry, docType } = invoice;

  const isCreditNote = docType === 'credit-note';

  const getTitle = () => {
    if (!isCreditNote) {
      return 'FACTURA DE VENTA';
    }
    if (reason === 'Anulación de factura') {
      return 'ANULACIÓN DE FACTURA';
    }
    return 'DEVOLUCIÓN A CLIENTES';
  };

  return (
    <div ref={ref} className="p-8 bg-white text-black font-sans text-sm">
      <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{getTitle()}</h1>
          <h2 className="text-2xl font-bold text-red-600">{isCreditNote ? `(Nota de Crédito ${id})` : id}</h2>
          {isCreditNote && originalInvoiceId && (
            <p className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 inline-block rounded mt-1">Documento Afectado: {originalInvoiceId}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">{dianResolution}</p>
        </div>
        <div className="text-right">
           <img  className="w-24 h-24 mb-2 ml-auto" alt="Logo de Mi Empresa" src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
          <p className="text-xl font-bold">Mi Empresa S.A.S</p>
          <p>NIT: 900.111.222-3</p>
          <p>Calle Falsa 123, Bogotá</p>
          <p>facturacion@miempresa.com</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-8 my-6">
        <div>
          <h3 className="font-bold mb-2 border-b">CLIENTE:</h3>
          <p className="font-bold">{client.name}</p>
          <p>NIT: {client.nit}</p>
          <p>{client.address}</p>
          <p>{client.email}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="font-bold">Fecha de Expedición:</span>
            <span>{formatDate(issueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Fecha de Vencimiento:</span>
            <span>{formatDate(dueDate)}</span>
          </div>
           {isCreditNote && reason && (
            <div className="flex justify-between mt-2 pt-2 border-t">
              <span className="font-bold">Motivo:</span>
              <span className="max-w-[70%] text-right">{reason}</span>
            </div>
          )}
        </div>
      </section>

      <section>
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 text-left">Descripción</th>
              <th className="p-2 text-center">Unidad</th>
              <th className="p-2 text-right">Cant.</th>
              <th className="p-2 text-right">IVA %</th>
              <th className="p-2 text-right">Vlr. Unitario</th>
              <th className="p-2 text-right">Vlr. Total</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.unit || 'UND'}</td>
                <td className="p-2 text-right">{item.quantity}</td>
                <td className="p-2 text-right">{item.tax}%</td>
                <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                <td className="p-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex justify-end mt-6">
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-bold">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">IVA:</span>
            <span>{formatCurrency(totalTax)}</span>
          </div>
          {retefuente > 0 && (
            <div className="flex justify-between">
              <span className="font-bold">(-) ReteFuente:</span>
              <span>{formatCurrency(retefuente)}</span>
            </div>
          )}
           {reteica > 0 && (
            <div className="flex justify-between">
              <span className="font-bold">(-) ReteICA:</span>
              <span>{formatCurrency(reteica)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold border-t-2 pt-2 mt-2">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </section>
      
      {notes && (
        <section className="mt-8 pt-4 border-t">
          <h3 className="font-bold mb-2">Notas:</h3>
          <p className="text-xs">{notes}</p>
        </section>
      )}
      
      {accountingEntry && (
        <section className="mt-8 pt-4 border-t">
          <h3 className="font-bold mb-2">Comprobante Contable: {accountingEntry.id}</h3>
          <table className="w-full text-xs">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-1 text-left">Cuenta</th>
                <th className="p-1 text-left">Descripción</th>
                <th className="p-1 text-right">Débito</th>
                <th className="p-1 text-right">Crédito</th>
              </tr>
            </thead>
            <tbody>
              {accountingEntry.entries.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="p-1">{entry.account}</td>
                  <td className="p-1">{entry.accountName}</td>
                  <td className="p-1 text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : ''}</td>
                  <td className="p-1 text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="mt-8 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <h3 className="font-bold mb-2">{isCreditNote ? 'CUDE' : 'CUFE'} (Código Único de Documento Electrónico)</h3>
                <p className="text-xs break-all">{cufe}</p>
                <h3 className="font-bold mb-2 mt-4">Respuesta DIAN</h3>
                <p className="text-xs">{dianResponse}</p>
            </div>
            <div className="flex items-center justify-center">
                 <QRCode value={cufe || ''} />
            </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 mt-12 pt-4 border-t">
        <p>Documento generado por FacturaColombia. Gracias por su compra.</p>
      </footer>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
export default InvoicePreview;