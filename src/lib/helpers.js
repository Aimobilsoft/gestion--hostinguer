import { es } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'pagada':
      return 'bg-green-500';
    case 'pendiente':
      return 'bg-yellow-500';
    case 'vencida':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const getDianStatusColor = (status) => {
  switch (status) {
    case 'aprobada':
      return 'bg-green-500';
    case 'enviada':
      return 'bg-blue-500';
    case 'rechazada':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const formatDate = (date) => {
    if (!date) return "Seleccione una fecha";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const isNewProduct = (createdAt) => {
  if (!createdAt) return false;
  const productDate = new Date(createdAt);
  const today = new Date();
  return differenceInDays(today, productDate) <= 7;
};