// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('! Seeding database...');

  await prisma.datasetModification.deleteMany();
  await prisma.chatbotResponse.deleteMany();
  await prisma.geoDataset.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ============================================
  // USERS - CON SUPER_ADMIN
  // ============================================

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@platform.com',
      passwordHash: await bcrypt.hash('superadmin123', 10),
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.super_admin,
      preferredLatitude: 38.1879539,
      preferredLongitude: 15.6416525,
      preferredAddress: 'Catona, Reggio di Calabria, Reggio Calabria, Calabria, 89135, Italia',
    },
  });

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@platform.com',
      passwordHash: await bcrypt.hash('Admin123456', 10),
      firstName: 'Admin',
      lastName: 'Sistema',
      role: Role.admin,
      preferredLatitude: 38.1937,
      preferredLongitude: 15.5542,
      preferredAddress: 'Messina, Sicilia, Italia',
    },
  });

  // Utente normale
  const user = await prisma.user.create({
    data: {
      email: 'mario.rossi@example.com',
      passwordHash: await bcrypt.hash('User123456', 10),
      firstName: 'Mario',
      lastName: 'Rossi',
      role: Role.user,
      preferredLatitude: 38.1937,
      preferredLongitude: 15.5542,
      preferredAddress: 'Messina, Sicilia, Italia',
    },
  });

  console.log('Users created');
  console.log(`   - Super Admin: ${superAdmin.email}`);
  console.log(`   - Admin: ${admin.email}`);
  console.log(`   - User: ${user.email}`);

  // ============================================
  // CATEGORIES
  // ============================================
  const categoryEnti = await prisma.category.create({
    data: {
      name: 'Enti',
      description: 'Enti pubblici e istituzioni',
    },
  });

  const categoryServizi = await prisma.category.create({
    data: {
      name: 'Servizi',
      description: 'Servizi pubblici e privati',
    },
  });

  const categoryTurismo = await prisma.category.create({
    data: {
      name: 'Turismo',
      description: 'Punti di interesse turistico e culturale',
    },
  });

  console.log('Categories created');

  // ============================================
  // GEO DATASETS (RENAMED)
  // ============================================
  const dataset1 = await prisma.geoDataset.create({
    data: {
      name: 'Enti Messina',
      description: 'Enti pubblici della città di Messina',
      geojsonFile: 'Enti_Di_Messina.geojson',
      iconFile: 'Enti_Di_Messina.png',
      location: 'Messina, Sicily, Italy',
      categoryId: categoryEnti.categoryId,
    },
  });

  const dataset2 = await prisma.geoDataset.create({
    data: {
      name: 'Servizi Messina',
      description: 'Servizi pubblici di Messina',
      geojsonFile: 'Servizi_Di_Messina.geojson',
      iconFile: 'Servizi_Di_Messina.png',
      location: 'Messina, Sicily, Italy',
      categoryId: categoryServizi.categoryId,
    },
  });

  const dataset3 = await prisma.geoDataset.create({
    data: {
      name: 'Punti di Interesse Messina',
      description: 'Attrazioni turistiche e culturali di Messina',
      geojsonFile: 'Punti_Di_Interesse.geojson',
      iconFile: 'Punti_Di_Interesse.png',
      location: 'Messina, Sicily, Italy',
      categoryId: categoryTurismo.categoryId,
    },
  });

  console.log('Datasets created');

  // ============================================
  // DATASET MODIFICATIONS (RENAMED)
  // ============================================
  await prisma.datasetModification.create({
    data: {
      userId: admin.userId,
      datasetId: dataset1.datasetId,
      actionType: 'created',
      versionAfter: 1,
    },
  });

  await prisma.datasetModification.create({
    data: {
      userId: admin.userId,
      datasetId: dataset2.datasetId,
      actionType: 'created',
      versionAfter: 1,
    },
  });

  await prisma.datasetModification.create({
    data: {
      userId: admin.userId,
      datasetId: dataset3.datasetId,
      actionType: 'created',
      versionAfter: 1,
    },
  });

  console.log('Dataset modifications tracked');
  console.log('');
  console.log('Seeding completed!');
  console.log('');
  console.log('Summary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Categories: ${await prisma.category.count()}`);
  console.log(`   Datasets: ${await prisma.geoDataset.count()}`);
  console.log(`   Modifications: ${await prisma.datasetModification.count()}`);
}

main()
  .catch((e) => {
    console.error('! Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
