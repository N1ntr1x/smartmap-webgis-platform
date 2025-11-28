export function truncateText(text: string, maxLength: number): string {
  // Restituisce la stringa originale se non supera la lunghezza massima,
  // altrimenti la tronca e aggiunge "..."
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export function formatDate(dateString?: Date): string {
  // Accetta un Date (opzionale). Se mancante o non valido restituisce stringa vuota.
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    // Restituisce data nel formato italiano DD/MM/YYYY
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

export function formatFileSize(bytes: number): string {
  // Converte byte in unità più leggibili; arrotonda a 2 cifre decimali.
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}