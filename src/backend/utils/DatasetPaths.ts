import path from 'path';
import { AppPaths } from '@/backend/config';

// Helper per path dei dataset geografici
export class DatasetPaths {
  private static DATASETS_DIR = AppPaths.DATASETS;

  // Estrae il nome della cartella dal file GeoJSON
  static getFolderName(geojsonFile: string): string {
    return geojsonFile.replace(/\.geojson$/i, '');
  }

  // Restituisce il path completo alla cartella del dataset
  static getDatasetFolder(geojsonFile: string): string {
    const folderName = this.getFolderName(geojsonFile);
    return path.join(this.DATASETS_DIR, folderName);
  }

  // Restituisce il path completo al file GeoJSON
  static getGeoJsonPath(geojsonFile: string): string {
    const folderName = this.getFolderName(geojsonFile);
    return path.join(this.DATASETS_DIR, folderName, geojsonFile);
  }

  // Restituisce il path completo all'icona del dataset
  static getIconPath(geojsonFile: string, iconFile: string): string {
    const folderName = this.getFolderName(geojsonFile);
    return path.join(this.DATASETS_DIR, folderName, iconFile);
  }

  // Restituisce il path completo alla cartella di upload di un dataset
  static getUploadsFolder(geojsonFile: string): string {
    const folderName = this.getFolderName(geojsonFile);
    return path.join(this.DATASETS_DIR, folderName, 'uploads');
  }
}
