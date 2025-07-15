import { useState } from 'react';
import { format } from 'date-fns';

const formatAccountNumber = (account) => {
  if (!account) return '';
  if (account.length >= 8) return account;
  return account.padEnd(8, '0');
};

const generateAccountingEntry = (type, documentId, amount, description, branchId, warehouseId, paymentMethodAccount = null, items = [], isPaidInvoice = false) => {
  const entryId = `COMP-${Date.now()}`;
  const date = format(new Date(), 'yyyy-MM-dd');
  
  let entries = [];
  
  switch (type) {
    case 'FV': // Factura de Venta
      if (paymentMethodAccount) {
        entries.push({ account: formatAccountNumber(paymentMethodAccount.accountCode), accountName: paymentMethodAccount.accountName, debit: amount, credit: 0 });
      } else {
        entries.push({ account: formatAccountNumber('13050101'), accountName: 'Clientes Nacionales', debit: amount, credit: 0 });
      }
      
      if (items && items.length > 0) {
        const groupedByAccount = {};
        let totalTaxAmount = 0;

        items.forEach(item => {
          const incomeAccount = item.accountingConfig?.incomeAccount || '41350101';
          const incomeAccountName = item.accountingConfig?.incomeAccountName || 'Comercio al por Mayor y Menor';
          const itemSubtotal = (item.quantity * item.price) * (1 - (item.discount || 0) / 100);
          const itemTax = itemSubtotal * ((item.tax || 0) / 100);
          totalTaxAmount += itemTax;

          if (!groupedByAccount[incomeAccount]) {
            groupedByAccount[incomeAccount] = { accountName: incomeAccountName, amount: 0 };
          }
          groupedByAccount[incomeAccount].amount += itemSubtotal;
        });
        
        Object.entries(groupedByAccount).forEach(([account, data]) => {
          entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: 0, credit: data.amount });
        });
        
        if(totalTaxAmount > 0) {
          entries.push({ account: formatAccountNumber('24080101'), accountName: 'IVA por Pagar', debit: 0, credit: totalTaxAmount });
        }
      } else {
        entries.push({ account: formatAccountNumber('41350101'), accountName: 'Comercio al por Mayor y Menor', debit: 0, credit: amount / 1.19 });
        entries.push({ account: formatAccountNumber('24080101'), accountName: 'IVA por Pagar', debit: 0, credit: amount - (amount / 1.19) });
      }
      break;
      
    case 'CV': // Costo de Ventas
      if (items && items.length > 0) {
        const groupedByCostAccount = {};
        const groupedByInventoryAccount = {};
        
        items.forEach(item => {
          if (!item.requiresInventoryControl) return;

          const costAccount = item.accountingConfig?.costOfSalesAccount || '61350101';
          const costAccountName = item.accountingConfig?.costOfSalesAccountName || 'Costo de Ventas';
          const inventoryAccount = item.accountingConfig?.inventoryWithdrawalAccount || '14350101';
          const inventoryAccountName = item.accountingConfig?.inventoryWithdrawalAccountName || 'Inventarios';
          const totalCost = item.quantity * (item.cost || 0);
          
          if (!groupedByCostAccount[costAccount]) {
            groupedByCostAccount[costAccount] = { accountName: costAccountName, amount: 0 };
          }
          groupedByCostAccount[costAccount].amount += totalCost;
          
          if (!groupedByInventoryAccount[inventoryAccount]) {
            groupedByInventoryAccount[inventoryAccount] = { accountName: inventoryAccountName, amount: 0 };
          }
          groupedByInventoryAccount[inventoryAccount].amount += totalCost;
        });
        
        Object.entries(groupedByCostAccount).forEach(([account, data]) => {
          entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: data.amount, credit: 0 });
        });
        
        Object.entries(groupedByInventoryAccount).forEach(([account, data]) => {
          entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: 0, credit: data.amount });
        });
      }
      break;
      
    case 'AF': // Anulación de Factura (Reversión de FV)
      const creditAccountAnulacion = isPaidInvoice ? '28050101' : '13050101';
      const creditAccountNameAnulacion = isPaidInvoice ? 'Anticipos y Avances Recibidos' : 'Clientes';

      entries.push({ account: formatAccountNumber(creditAccountAnulacion), accountName: creditAccountNameAnulacion, debit: 0, credit: amount });

      if (items && items.length > 0) {
          const groupedByAccount = {};
          let totalTaxAmount = 0;

          items.forEach(item => {
              const quantity = item.returnQuantity || item.quantity;
              const incomeAccount = item.accountingConfig?.incomeAccount || '41350101';
              const incomeAccountName = item.accountingConfig?.incomeAccountName || 'Comercio al por Mayor y Menor';
              const itemSubtotal = (quantity * item.price) * (1 - (item.discount || 0) / 100);
              const itemTax = itemSubtotal * ((item.tax || 0) / 100);
              totalTaxAmount += itemTax;

              if (!groupedByAccount[incomeAccount]) {
                  groupedByAccount[incomeAccount] = { accountName: incomeAccountName, amount: 0 };
              }
              groupedByAccount[incomeAccount].amount += itemSubtotal;
          });
          
          Object.entries(groupedByAccount).forEach(([account, data]) => {
              entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: data.amount, credit: 0 });
          });
          
          if(totalTaxAmount > 0) {
              entries.push({ account: formatAccountNumber('24080101'), accountName: 'IVA por Pagar', debit: totalTaxAmount, credit: 0 });
          }
      } else {
          entries.push({ account: formatAccountNumber('41350101'), accountName: 'Comercio al por Mayor y Menor', debit: amount / 1.19, credit: 0 });
          entries.push({ account: formatAccountNumber('24080101'), accountName: 'IVA por Pagar', debit: amount - (amount / 1.19), credit: 0 });
      }
      break;
      
    case 'DC': // Devolución de Clientes
      const creditAccountDevolucion = isPaidInvoice ? '28050101' : '13050101';
      const creditAccountNameDevolucion = isPaidInvoice ? 'Anticipos y Avances Recibidos' : 'Clientes';
      
      entries.push({ account: formatAccountNumber(creditAccountDevolucion), accountName: creditAccountNameDevolucion, debit: 0, credit: amount });

      const groupedByDevolucionAccount = {};
      let totalTaxAmountDevolucion = 0;

      items.forEach(item => {
          const quantity = item.returnQuantity || item.quantity;
          const devolucionAccount = '41750101'; 
          const devolucionAccountName = 'Devoluciones en Ventas';
          const itemSubtotal = (quantity * item.price) * (1 - (item.discount || 0) / 100);
          const itemTax = itemSubtotal * ((item.tax || 0) / 100);
          totalTaxAmountDevolucion += itemTax;

          if (!groupedByDevolucionAccount[devolucionAccount]) {
              groupedByDevolucionAccount[devolucionAccount] = { accountName: devolucionAccountName, amount: 0 };
          }
          groupedByDevolucionAccount[devolucionAccount].amount += itemSubtotal;
      });

      Object.entries(groupedByDevolucionAccount).forEach(([account, data]) => {
          entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: data.amount, credit: 0 });
      });

      if(totalTaxAmountDevolucion > 0) {
          entries.push({ account: formatAccountNumber('24080101'), accountName: 'IVA por Pagar', debit: totalTaxAmountDevolucion, credit: 0 });
      }
      break;

    case 'RCV': // Reversión Costo de Ventas
      if (items && items.length > 0) {
          const groupedByCostAccount = {};
          const groupedByInventoryAccount = {};
          
          items.forEach(item => {
              if (!item.requiresInventoryControl) return;
              
              const quantity = item.returnQuantity || item.quantity;
              const costAccount = item.accountingConfig?.costOfSalesAccount || '61350101';
              const costAccountName = item.accountingConfig?.costOfSalesAccountName || 'Costo de Ventas';
              const inventoryAccount = item.accountingConfig?.inventoryWithdrawalAccount || '14350101';
              const inventoryAccountName = item.accountingConfig?.inventoryWithdrawalAccountName || 'Inventarios';
              const totalCost = quantity * (item.cost || 0);
              
              if (!groupedByCostAccount[costAccount]) {
                  groupedByCostAccount[costAccount] = { accountName: costAccountName, amount: 0 };
              }
              groupedByCostAccount[costAccount].amount += totalCost;
              
              if (!groupedByInventoryAccount[inventoryAccount]) {
                  groupedByInventoryAccount[inventoryAccount] = { accountName: inventoryAccountName, amount: 0 };
              }
              groupedByInventoryAccount[inventoryAccount].amount += totalCost;
          });
          
          Object.entries(groupedByCostAccount).forEach(([account, data]) => {
              entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: 0, credit: data.amount });
          });
          
          Object.entries(groupedByInventoryAccount).forEach(([account, data]) => {
              entries.push({ account: formatAccountNumber(account), accountName: data.accountName, debit: data.amount, credit: 0 });
          });
      }
      break;
  }

  return {
    id: entryId,
    type,
    documentId,
    date,
    description,
    branchId,
    warehouseId,
    entries: entries.filter(e => e.debit > 0 || e.credit > 0),
    total: amount,
    status: 'contabilizado'
  };
};

const initialAccountingEntries = [];

export const useAccounting = () => {
  const [accountingEntries, setAccountingEntries] = useState(initialAccountingEntries);

  const addAccountingEntry = (type, documentId, amount, description, branchId, warehouseId, paymentMethodAccount = null, items = [], isPaidInvoice = false) => {
    const entry = generateAccountingEntry(type, documentId, amount, description, branchId, warehouseId, paymentMethodAccount, items, isPaidInvoice);
    if(entry.entries.length > 0) {
      setAccountingEntries(prev => [entry, ...prev]);
    }
    return entry;
  };

  const getEntriesByDocument = (documentId) => {
    return accountingEntries.filter(entry => entry.documentId === documentId);
  };

  const getAccountingEntryByDocId = (documentId) => {
    return accountingEntries.find(entry => entry.documentId === documentId && ['FV', 'AF', 'DC'].includes(entry.type));
  };

  const getEntriesByType = (type) => {
    return accountingEntries.filter(entry => entry.type === type);
  };

  const getEntriesByDateRange = (startDate, endDate) => {
    return accountingEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  };

  return {
    accountingEntries,
    addAccountingEntry,
    getEntriesByDocument,
    getAccountingEntryByDocId,
    getEntriesByType,
    getEntriesByDateRange
  };
};