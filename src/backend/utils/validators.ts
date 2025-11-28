import { AppError } from "@/backend/errors"

export function validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim().length === 0) {
        throw new AppError('Email obbligatoria', 422);
    }

    if (!emailRegex.test(email)) {
        throw new AppError('Email non valida', 422);
    }

    if (email.length > 255) {
        throw new AppError('Email troppo lunga (max 255 caratteri)', 422);
    }
}

export function validatePassword(password: string): void {
    if (!password || password.length < 8) {
        throw new AppError('Password deve essere di almeno 8 caratteri', 422);
    }

    if (password.length > 100) {
        throw new AppError('Password troppo lunga (max 100 caratteri)', 422);
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        throw new AppError('Password deve contenere almeno una maiuscola, una minuscola e un numero', 422);
    }
}

export function validateName(name: string, fieldName: string = 'Nome'): void {
    if (!name || name.trim().length === 0) {
        throw new AppError(`${fieldName} obbligatorio`, 422);
    }

    if (name.trim().length < 2) {
        throw new AppError(`${fieldName} deve avere almeno 2 caratteri`, 422);
    }

    if (name.length > 100) {
        throw new AppError(`${fieldName} troppo lungo (max 100 caratteri)`, 422);
    }
}
