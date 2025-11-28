import { NextRequest, NextResponse } from 'next/server';
import { GeoDatasetController } from '@/backend/controllers';

const controller = new GeoDatasetController();

/*
 GET /api/geodatasets/stats
 */
export async function GET(request: NextRequest) {
  try {
    return controller.getDatasetsStats(request);
  } catch (error) {
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
