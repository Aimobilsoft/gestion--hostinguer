import React, { forwardRef } from 'react';
import { Calendar, CheckCircle, Clock, Mail, Phone, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import TenantInfo from '@/components/saas/TenantInfo';
import QRCode from '@/components/shared/QRCode';

const getDianStatusIcon = (status) => {
    switch (status) {
        case 'aprobada': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'rechazada': return <XCircle className="w-4 h-4 text-red-500" />;
        default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
};

const getDocumentTitle = (invoice) => {
    if (invoice.reason === 'Anulación de factura') {
        return 'Nota de Crédito (Anulación)';
    }
    return 'Nota de Crédito (Devolución)';
};

const CreditNotePreview = forwardRef(({ invoice, formatCurrency }, ref) => {
    if (!invoice) return null;

    const title = getDocumentTitle(invoice);

    return (
        <div ref={ref} className="p-8 bg-white text-gray-800 font-sans text-sm">
            <header className="flex justify-between items-start pb-4 border-b-2 border-gray-800">
                <div className="w-1/2">
                    <TenantInfo />
                </div>
                <div className="w-1/2 text-right">
                    <h1 className="text-3xl font-bold uppercase">{title}</h1>
                    <p className="text-xl font-semibold text-red-600">{invoice.id}</p>
                    <p className="text-xs">Resolución DIAN {invoice.resolutionId}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mt-6">
                <div>
                    <h2 className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2">Cliente</h2>
                    <div className="font-medium">
                        <p className="text-lg font-bold">{invoice.client.name}</p>
                        <p>NIT: {invoice.client.nit}</p>
                        <p>{invoice.client.address}</p>
                        <div className="flex items-center mt-1"><Mail className="w-4 h-4 mr-2 text-gray-500" /> {invoice.client.email}</div>
                        <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-500" /> {invoice.client.phone}</div>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2">Detalles del Documento</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <strong className="text-gray-600">Fecha Emisión:</strong>
                        <span>{format(parseISO(invoice.issueDate), 'dd/MM/yyyy')}</span>
                        
                        <strong className="text-gray-600">Factura Afectada:</strong>
                        <span>{invoice.originalInvoiceId}</span>

                        <strong className="text-gray-600">Vendedor:</strong>
                        <span>{invoice.client.assignedSalespersonId || 'N/A'}</span>
                    </div>
                </div>
            </section>

            {invoice.reason && (
                <section className="mt-6">
                    <h2 className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-2">Motivo</h2>
                    <p>{invoice.reason}</p>
                </section>
            )}

            <section className="mt-8">
                <table className="w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="text-left py-2 px-3 font-bold uppercase text-xs">Código</th>
                            <th className="text-left py-2 px-3 font-bold uppercase text-xs">Descripción</th>
                            <th className="text-center py-2 px-3 font-bold uppercase text-xs">Unidad</th>
                            <th className="text-center py-2 px-3 font-bold uppercase text-xs">Cant.</th>
                            <th className="text-right py-2 px-3 font-bold uppercase text-xs">Precio Unit.</th>
                            <th className="text-center py-2 px-3 font-bold uppercase text-xs">IVA%</th>
                            <th className="text-right py-2 px-3 font-bold uppercase text-xs">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-3">{item.productId}</td>
                                <td className="py-2 px-3">{item.name}</td>
                                <td className="py-2 px-3 text-center">{item.unit}</td>
                                <td className="py-2 px-3 text-center">{item.quantity}</td>
                                <td className="py-2 px-3 text-right">{formatCurrency(item.price)}</td>
                                <td className="py-2 px-3 text-center">{item.tax}%</td>
                                <td className="py-2 px-3 text-right font-semibold">{formatCurrency(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="flex justify-end mt-6">
                <div className="w-full max-w-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-right font-medium">{formatCurrency(invoice.subtotal)}</span>
                        
                        <span className="text-gray-600">IVA:</span>
                        <span className="text-right font-medium">{formatCurrency(invoice.totalTax)}</span>

                        <strong className="text-xl mt-2">TOTAL NOTA CRÉDITO:</strong>
                        <strong className="text-xl text-right mt-2">{formatCurrency(invoice.total)}</strong>
                    </div>
                </div>
            </section>

            {invoice.accountingEntry && (
                <section className="mt-8 pt-4 border-t">
                    <h3 className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-3">Comprobante Contable Asociado ({invoice.accountingEntry.id})</h3>
                    <table className="w-full text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-1 px-2 font-semibold">Cuenta</th>
                                <th className="text-left py-1 px-2 font-semibold">Nombre de la Cuenta</th>
                                <th className="text-right py-1 px-2 font-semibold">Débito</th>
                                <th className="text-right py-1 px-2 font-semibold">Crédito</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.accountingEntry.entries.map((entry, index) => (
                                <tr key={index} className="border-t">
                                    <td className="py-1 px-2 font-mono">{entry.account}</td>
                                    <td className="py-1 px-2">{entry.accountName}</td>
                                    <td className="py-1 px-2 text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                                    <td className="py-1 px-2 text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-bold border-t-2">
                            <tr>
                                <td colSpan="2" className="py-1 px-2 text-right">TOTALES</td>
                                <td className="py-1 px-2 text-right">{formatCurrency(invoice.accountingEntry.entries.reduce((sum, e) => sum + e.debit, 0))}</td>
                                <td className="py-1 px-2 text-right">{formatCurrency(invoice.accountingEntry.entries.reduce((sum, e) => sum + e.credit, 0))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            )}

            <footer className="mt-8 pt-4 border-t text-xs text-gray-500 flex justify-between items-end">
                <div>
                    <p className="font-bold mb-2">Representación impresa de la {title}</p>
                    <div className="flex items-center gap-2">
                        <strong>CUDE:</strong>
                        <span className="font-mono text-xxs">{invoice.cufe}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <strong>Estado DIAN:</strong>
                        <Badge variant="outline" className="flex items-center gap-1">
                            {getDianStatusIcon(invoice.dianStatus)}
                            <span className="capitalize">{invoice.dianStatus}</span>
                        </Badge>
                    </div>
                    <p className="mt-1">{invoice.dianResponse}</p>
                </div>
                <div className="text-right">
                    <QRCode value={invoice.cufe} />
                    <p className="mt-2">Generado por FacturaColombia SAAS</p>
                </div>
            </footer>
        </div>
    );
});

export default CreditNotePreview;