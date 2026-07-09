export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
