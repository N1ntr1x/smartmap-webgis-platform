import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/backend/services/UserService";
import { COOKIE_NAME } from "@/backend/middleware/auth";
import { CreateAdminDTO, UpdateOwnProfileDTO, UpdateUserByAdminDTO, ResetPasswordByAdminDTO } from "@/backend/dto/UserDTO";
import { JWTPayload } from "@/backend/utils";
import { asyncHandler } from "@/backend/utils";

export class UserController {
  private userService = new UserService();

  async getAllUsers(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const users = await this.userService.getAllUsers(true);
      return NextResponse.json({ users });
    });
  }

  async createAdmin(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body: CreateAdminDTO = await request.json();
      const user = await this.userService.createAdmin(body);
      return NextResponse.json(
        { user },
        { status: 201 }
      );
    });
  }

  async updateUser(request: NextRequest, userId: string, currentUser: JWTPayload): Promise<NextResponse> {
    return asyncHandler(async () => {
      const targetUserId = parseInt(userId, 10);
      const body: UpdateUserByAdminDTO = await request.json();
      const user = await this.userService.updateUserByAdmin(targetUserId, body, currentUser);
      return NextResponse.json({ user });
    });
  }

  async updateOwnProfile(request: NextRequest, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body: UpdateOwnProfileDTO = await request.json();
      const user = await this.userService.updateOwnProfile(userId, body);
      return NextResponse.json({ user });
    });
  }

  async deleteUser(request: NextRequest, userId: string, currentUser: JWTPayload): Promise<NextResponse> {
    return asyncHandler(async () => {
      const targetUserId = parseInt(userId, 10);
      await this.userService.deleteUser(targetUserId, currentUser);
      return NextResponse.json({ message: "Utente eliminato con successo" });
    });
  }

  async deleteOwnAccount(request: NextRequest, currentUser: JWTPayload): Promise<NextResponse> {
    return asyncHandler(async () => {
      await this.userService.deleteOwnAccount(currentUser);
      const response = NextResponse.json({ message: "Account eliminato con successo" });
      response.cookies.delete(COOKIE_NAME);
      return response;
    });
  }

  async changeUserPassword(request: NextRequest, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body = await request.json();
      await this.userService.changePassword(userId, body);
      return NextResponse.json({ message: "Password aggiornata con successo" });
    });
  }

  async resetPasswordByAdmin(request: NextRequest, userId: string, currentUser: JWTPayload): Promise<NextResponse> {
    return asyncHandler(async () => {
      const targetUserId = parseInt(userId, 10);
      const body: ResetPasswordByAdminDTO = await request.json();
      await this.userService.resetPasswordByAdmin(targetUserId, body, currentUser);
      return NextResponse.json({ message: "Password resettata con successo." });
    });
  }
}
