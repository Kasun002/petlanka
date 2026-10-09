import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

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
