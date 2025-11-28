import path from 'path';

// Configurazione path
export const AppPaths = {
  // Root progetto
  ROOT: process.cwd(),

  // Storage datasets
  STORAGE: path.join(process.cwd(), 'storage'),
  DATASETS: path.join(process.cwd(), 'storage', 'datasets'),
} as const;