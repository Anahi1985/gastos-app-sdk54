const formatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatMonto(monto: number): string {
  try {
    return formatter.format(monto);
  } catch {
    return `$${monto.toLocaleString('es-CL')}`;
  }
}

export function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-').map(Number);
  if (!year || !month || !day) return fecha;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
}

export function hoyISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}