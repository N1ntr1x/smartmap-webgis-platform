/* 
Classe custom AppError che estende Error
permette di generare errori custom con codici di stato
*/
export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}
