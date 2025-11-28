import { NextRequest } from 'next/server';
import { AuthController } from '@/backend/controllers';

const controller = new AuthController();

/*
POST /api/auth/logout
*/
export async function POST(request: NextRequest) {
  return controller.logout(request);
}
