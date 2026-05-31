export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',
    timeStyle: 'short',
  })
    .format(new Date(date))
    .replace(/\u00A0/g, ' ') 
}