import { useClientsData } from './useClientsData';
import { useProductsData } from './useProductsData';
import { useInvoicesData } from './useInvoicesData';
import { useConfigurationData } from './useConfigurationData';
import { useAccounting } from './useAccounting';
import { useInventory } from './useInventory';
import { usePurchasing } from './usePurchasing';
import { useSalesData } from './useSalesData';
import { useResolutions } from './useResolutions';

export const useData = () => {
  const clientsData = useClientsData();
  const productsData = useProductsData();
  const resolutionData = useResolutions();
  const configData = useConfigurationData({ deleteDianResolutionByOwner: resolutionData.deleteDianResolutionByOwner });
  const invoicesData = useInvoicesData(clientsData.applyAdvance);
  const purchasingData = usePurchasing();
  const salesData = useSalesData();

  const inventoryData = useInventory(productsData.products);

  const accountingData = useAccounting({
    invoices: invoicesData.invoices,
    creditNotes: invoicesData.creditNotes,
    inventory: inventoryData.inventory,
    getProductCost: inventoryData.getProductCost
  });

  return {
    ...clientsData,
    ...productsData,
    ...invoicesData,
    ...configData,
    ...resolutionData,
    ...accountingData,
    ...purchasingData,
    ...salesData,
    ...inventoryData,
    addWarehouseEntry: (entryData) => purchasingData.addWarehouseEntry(entryData, inventoryData.updateInventoryOnEntry),
  };
};