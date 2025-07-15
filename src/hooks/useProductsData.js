import { useState } from 'react';

const initialCategories = [
    { 
      id: '01', 
      name: 'Servicios',
      accountingConfig: {
        purchaseAccount: '', inventoryAccount: '', ivaGeneratedAccount: '2408', retefuenteAccount: '2365',
        reteicaAccount: '2368', incomeAccount: '4135', costOfSalesAccount: '6135', inventoryWithdrawalAccount: ''
      }
    },
    { 
      id: '02', 
      name: 'Bienes',
      accountingConfig: {
        purchaseAccount: '1435', inventoryAccount: '1435', ivaGeneratedAccount: '2408', retefuenteAccount: '2365',
        reteicaAccount: '2368', incomeAccount: '4135', costOfSalesAccount: '6135', inventoryWithdrawalAccount: '1435'
      }
    },
];

const initialProductLines = [
    { 
      id: 'SE', name: 'Servicios Empresariales', categoryId: '01',
      accountingConfig: {
        purchaseAccount: '', inventoryAccount: '', ivaGeneratedAccount: '2408', retefuenteAccount: '2365',
        reteicaAccount: '2368', incomeAccount: '4135', costOfSalesAccount: '6135', inventoryWithdrawalAccount: ''
      }
    },
    { 
      id: 'ST', name: 'Servicios Técnicos', categoryId: '01',
      accountingConfig: {
        purchaseAccount: '', inventoryAccount: '', ivaGeneratedAccount: '2408', retefuenteAccount: '2365',
        reteicaAccount: '2368', incomeAccount: '4175', costOfSalesAccount: '6175', inventoryWithdrawalAccount: ''
      }
    },
    { 
      id: 'HW', name: 'Hardware', categoryId: '02',
      accountingConfig: {
        purchaseAccount: '1435', inventoryAccount: '1435', ivaGeneratedAccount: '2408', retefuenteAccount: '2365',
        reteicaAccount: '2368', incomeAccount: '4135', costOfSalesAccount: '6135', inventoryWithdrawalAccount: '1435'
      }
    },
];

const initialProducts = [
  { 
    id: 1, name: 'Consultoría Empresarial', code: 'SE-00001', price: 500000, cost: 300000, tax: 19, 
    description: 'Servicios de consultoría especializada', categoryId: '01', lineId: 'SE',
    requiresInventoryControl: false, status: 'active', createdAt: new Date().toISOString(),
    accountingConfig: {
      incomeAccount: '4135', costOfSalesAccount: '6135',
    }
  },
  { 
    id: 2, name: 'Licencia de Software', code: 'ST-00001', price: 1200000, cost: 800000, tax: 19, 
    description: 'Licencia anual de software de gestión', categoryId: '01', lineId: 'ST',
    requiresInventoryControl: false, status: 'active', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    accountingConfig: {
      incomeAccount: '4175', costOfSalesAccount: '6175',
    }
  },
  { 
    id: 3, name: 'Computador Portátil Pro', code: 'HW-00001', price: 3500000, cost: 2800000, tax: 19, 
    description: 'Computador portátil de alto rendimiento', categoryId: '02', lineId: 'HW',
    requiresInventoryControl: true, status: 'inactive', createdAt: new Date().toISOString(),
    accountingConfig: {
      incomeAccount: '4135', costOfSalesAccount: '6135', inventoryWithdrawalAccount: '1435'
    }
  },
];

export const useProductsData = () => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [productLines, setProductLines] = useState(initialProductLines);

  const getNextCategoryId = () => {
    const allIds = categories.map(cat => parseInt(cat.id, 10));
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
    return String(maxId + 1).padStart(2, '0');
  };

  const getNextProductCode = (lineId) => {
    const line = productLines.find(l => l.id === lineId);
    if (!line) return "CÓDIGO_INVALIDO";
    const productsInLine = products.filter(p => p.lineId === lineId);
    return `${line.id}-${String(productsInLine.length + 1).padStart(5, '0')}`;
  };

  const addProduct = (productData) => { 
    const newProduct = { 
      ...productData, 
      id: crypto.randomUUID(), 
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]); 
  };
  const updateProduct = (productId, updatedData) => { setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p)); };
  
  const toggleProductStatus = (productId) => {
    let updatedProduct;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        updatedProduct = { ...p, status: p.status === 'active' ? 'inactive' : 'active' };
        return updatedProduct;
      }
      return p;
    }));
    return updatedProduct;
  };

  const addCategory = (categoryData) => { setCategories(prev => [{ ...categoryData, id: getNextCategoryId() }, ...prev]); };
  const updateCategory = (categoryId, updatedData) => { setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...updatedData } : c)); };
  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    const linesToDelete = productLines.filter(l => l.categoryId === categoryId).map(l => l.id);
    setProductLines(prev => prev.filter(l => l.categoryId !== categoryId));
    setProducts(prev => prev.filter(p => !linesToDelete.includes(p.lineId)));
  };

  const addProductLine = (lineData) => { setProductLines(prev => [{ ...lineData, id: lineData.id.toUpperCase() }, ...prev]); };
  const updateProductLine = (lineId, updatedData) => { setProductLines(prev => prev.map(l => l.id === lineId ? { ...l, ...updatedData } : l)); };
  const deleteProductLine = (lineId) => {
    setProductLines(prev => prev.filter(l => l.id !== lineId));
    setProducts(prev => prev.filter(p => p.lineId !== lineId));
  };

  return {
    products, categories, productLines,
    addProduct, updateProduct, toggleProductStatus, getNextProductCode,
    addCategory, updateCategory, deleteCategory, getNextCategoryId,
    addProductLine, updateProductLine, deleteProductLine,
  };
};