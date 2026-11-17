import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

try {
  process.loadEnvFile();
} catch {}

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Librarian123!', 10);
  await prisma.user.upsert({
    where: { email: 'librarian@library.test' },
    update: {},
    create: {
      email: 'librarian@library.test',
      name: 'Head Librarian',
      password,
      role: 'LIBRARIAN',
    },
  });
  console.log('Librarian ready');
}

main().finally(() => prisma.$disconnect());
