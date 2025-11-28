import { UserRepository } from "@/backend/repositories/UserRepository";
import {
  LoginDTO,
  RegisterDTO,
  AuthResponseDTO
} from "@/backend/dto";
import {
  validateEmail,
  validatePassword,
  validateName
} from "@/backend/utils";
import { generateToken } from "@/backend/utils/jwt";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { AppError } from "@/backend/errors"

// Numero di round per generare l'hashing della password
const SALT_ROUNDS = 10;

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Login
  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    // Cerca l'utente tramite email
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError("Email o password non corretti", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account disattivato", 403);
    }

    // Verifica la password contro l'hash memorizzato
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Email o password non corretti", 401);
    }

    // Genera il token JWT per la sessione
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    return this.mapToAuthResponse(user, token);
  }

  // Registrazione
  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    // Validazione campi base
    validateEmail(dto.email);
    validatePassword(dto.password);
    validateName(dto.firstName);

    const exists = await this.userRepository.existsByEmail(dto.email);

    if (exists) {
      throw new AppError("Email già registrata", 409);
    }

    // Genera l'hash della password
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.user,
      preferredLatitude: dto.preferredLatitude,
      preferredLongitude: dto.preferredLongitude,
      preferredAddress: dto.preferredAddress,
    });

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    return this.mapToAuthResponse(user, token);
  }

  // Ottiene i dati dell'utente autenticato
  async getMe(userId: number): Promise<any> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new AppError("Utente non trovato", 404);
    }

    return this.mapUserToProfile(user);
  }

  ////////////// MAPPER E METODI PRIVATI //////////////

  private mapToAuthResponse(user: any, token: string): AuthResponseDTO {
    // Costruisce la risposta di autenticazione AuthResponseDTO
    return {
      user: {
        id: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        preferredLatitude: user.preferredLatitude,
        preferredLongitude: user.preferredLongitude,
        preferredAddress: user.preferredAddress,
      },
      token,
    };
  }

  private mapUserToProfile(user: any) {
    return {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      preferredLatitude: user.preferredLatitude,
      preferredLongitude: user.preferredLongitude,
      preferredAddress: user.preferredAddress,
    };
  }
}
