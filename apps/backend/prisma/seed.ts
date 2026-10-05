import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const existing = await prisma.admin.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (existing) {
    console.log('SUPER_ADMIN already exists, skipping seed');
    return;
  }

  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'changeme123!',
    10,
  );

  await prisma.admin.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@petlanka.lk',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Seeded SUPER_ADMIN:', process.env.SEED_ADMIN_EMAIL ?? 'admin@petlanka.lk');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
