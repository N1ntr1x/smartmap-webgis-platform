import { NextRequest } from 'next/server';
import { AuthController } from '@/backend/controllers';

const controller = new AuthController();

/*
POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  return controller.login(request);
}
