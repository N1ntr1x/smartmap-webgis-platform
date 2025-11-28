/* 
  Spiegazione:
  - Prisma definisce gli enum nello schema e, al momento della generazione, fornisce
    sia un tipo TypeScript (esempio type Role = 'user' | 'admin' | 'super_admin') sia un
    oggetto/runtime helper quando importi @prisma/client. Tuttavia importare @prisma/client
    nelle interfacce/DTO condivise può creare problemi (dipendenze circolari, bundle/server-only import)
    perché @prisma/client è pensato per l'ambiente server.
  - Un tipo TypeScript (union type) esiste solo a compile-time: non produce nulla
    nel JS runtime, quindi non può essere usato dove serve un valore runtime.
  - Un enum TypeScript (export enum ...) viene convertito in un oggetto JS al runtime,
    quindi fornisce sia il tipo per TypeScript sia i valori disponibili a runtime senza importare
    il client Prisma. Questo rende gli enum più pratici per DTO che possono essere letti
    sia dal server sia da parti del codice che necessitano del valore a runtime.
  - Per evitare import diretti di @prisma/client nei DTO e prevenire possibili problemi
    con bundling o dipendenze circolari, qui definiamo un enum locale UserRole.
*/
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}