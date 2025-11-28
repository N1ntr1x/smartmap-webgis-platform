import { NextRequest } from 'next/server';
import { AuthController } from '@/backend/controllers';

const controller = new AuthController();

/**
 POST /api/auth/register
 */
export async function POST(request: NextRequest) {
  return controller.register(request);
}
