import { useState } from 'react';

const initialDianResolutions = [
  {
    id: 'RES-001', resolutionNumber: '18764003688395', resolutionDate: '2025-01-01',
    validFrom: '2025-01-01', validUntil: '2026-12-31', branchId: 'SEDE-001',
    warehouseId: '', documentType: 'invoice', prefix: 'FAC', rangeFrom: 1,
    rangeTo: 5000, currentNumber: 3, technicalKey: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
    testSetId: 'SetDePruebas123', isActive: true, description: 'Resolución principal para facturación electrónica'
  },
  {
    id: 'RES-002', resolutionNumber: '18764003688396', resolutionDate: '2025-01-01',
    validFrom: '2025-01-01', validUntil: '2025-07-30', branchId: 'SEDE-001',
    warehouseId: '', documentType: 'credit_note', prefix: 'NC', rangeFrom: 1,
    rangeTo: 1000, currentNumber: 995, technicalKey: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162d',
    testSetId: 'SetDePruebas124', isActive: true, description: 'Resolución para notas de crédito'
  }
];

export const useResolutions = () => {
  const [dianResolutions, setDianResolutions] = useState(initialDianResolutions);

  const checkResolutionLimits = (resolution) => {
    if (!resolution) return { isOk: false, warnings: ['No hay resolución activa para este documento.'], isCritical: true };
    
    const warnings = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validUntil = new Date(resolution.validUntil);
    
    const daysLeft = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30 && daysLeft >= 0) {
      warnings.push(`La resolución vence en ${daysLeft} días.`);
    }
    
    const numbersLeft = resolution.rangeTo - resolution.currentNumber + 1;
    if (numbersLeft <= 100 && numbersLeft > 0) {
      warnings.push(`Quedan ${numbersLeft} consecutivos disponibles.`);
    }
    
    const isExpired = today > validUntil;
    const isExhausted = resolution.currentNumber > resolution.rangeTo;
    
    if (isExpired) warnings.push('La resolución ha expirado.');
    if (isExhausted) warnings.push('Los consecutivos se han agotado.');
    
    return {
      isOk: !isExpired && !isExhausted,
      warnings,
      isCritical: isExpired || isExhausted
    };
  };

  const getCurrentResolution = (branchId, warehouseId, documentType = 'invoice') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const applicableResolutions = dianResolutions.filter(resolution => {
      const validFrom = new Date(resolution.validFrom);
      
      return (
        resolution.isActive &&
        resolution.branchId === branchId &&
        (resolution.warehouseId === '' || resolution.warehouseId === warehouseId) &&
        resolution.documentType === documentType &&
        today >= validFrom
      );
    });
    
    const warehouseSpecific = applicableResolutions.find(r => r.warehouseId === warehouseId);
    return warehouseSpecific || applicableResolutions.find(r => r.warehouseId === '') || null;
  };

  const getNextNumber = (resolutionId) => {
    const resolution = dianResolutions.find(r => r.id === resolutionId);
    if (!resolution) return 'N/A';
    return `${resolution.prefix}-${String(resolution.currentNumber).padStart(3, '0')}`;
  };

  const updateResolutionNumber = (resolutionId) => {
    setDianResolutions(prev => prev.map(res => 
      res.id === resolutionId 
        ? { ...res, currentNumber: res.currentNumber + 1 }
        : res
    ));
  };

  const addDianResolution = (resolutionData) => {
    const newResolution = { ...resolutionData, id: crypto.randomUUID() };
    setDianResolutions(prev => [newResolution, ...prev]);
    return newResolution;
  };

  const updateDianResolution = (resolutionId, updatedData) => {
    setDianResolutions(prev => prev.map(r => r.id === resolutionId ? { ...r, ...updatedData } : r));
  };

  const deleteDianResolution = (resolutionId) => {
    setDianResolutions(prev => prev.filter(r => r.id !== resolutionId));
  };

  const deleteDianResolutionByOwner = ({ branchId, warehouseId }) => {
    setDianResolutions(prev => prev.filter(r => {
      if (branchId && r.branchId === branchId) return false;
      if (warehouseId && r.warehouseId === warehouseId) return false;
      return true;
    }));
  };

  return {
    dianResolutions,
    getCurrentResolution,
    checkResolutionLimits,
    getNextNumber,
    updateResolutionNumber,
    addDianResolution,
    updateDianResolution,
    deleteDianResolution,
    deleteDianResolutionByOwner,
  };
};