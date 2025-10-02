export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const getDateStatus = (dateString: string | undefined): string => {
  if (!dateString) return 'unknown';
  const d = new Date(dateString);
  const now = new Date();
  if (isNaN(d.getTime())) return 'unknown';
  if (d.toDateString() === now.toDateString()) return 'today';
  return d < now ? 'past' : 'future';
};
