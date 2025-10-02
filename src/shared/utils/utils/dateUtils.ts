// src/utils/dateUtils.ts

// ✅ 1. Tipamos el parámetro de entrada y el valor de retorno.
// La función espera un 'string' y siempre devolverá un 'string'.
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
  const month = String(adjustedDate.getMonth() + 1);
  const day = String(adjustedDate.getDate());
  return `${month}/${day}`;
};

// ✅ 2. Tipamos esta función.
// Puede recibir un 'string' o 'undefined'.
// Devolverá un 'string' ('on-time', 'off-time', o '').
export const getDateStatus = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const today = new Date();
  const dueDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(23, 59, 59, 999);
  return dueDate < today ? 'off-time' : 'on-time';
};
