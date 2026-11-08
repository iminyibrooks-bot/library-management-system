import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog: Record<string, [string, string][]> = {
  Fantasy: [
    ['The Hobbit', 'J.R.R. Tolkien'],
    ['A Wizard of Earthsea', 'Ursula K. Le Guin'],
    ['The Name of the Wind', 'Patrick Rothfuss'],
    ['Mistborn', 'Brandon Sanderson'],
  ],
  'Science Fiction': [
    ['Dune', 'Frank Herbert'],
    ['Neuromancer', 'William Gibson'],
    ['The Left Hand of Darkness', 'Ursula K. Le Guin'],
    ['Project Hail Mary', 'Andy Weir'],
  ],
  Mystery: [
    ['And Then There Were None', 'Agatha Christie'],
    ['The Hound of the Baskervilles', 'Arthur Conan Doyle'],
    ['Gone Girl', 'Gillian Flynn'],
    ['The Girl with the Dragon Tattoo', 'Stieg Larsson'],
  ],
  'African Literature': [
    ['Things Fall Apart', 'Chinua Achebe'],
    ['Weep Not, Child', "Ngũgĩ wa Thiong'o"],
    ['Half of a Yellow Sun', 'Chimamanda Ngozi Adichie'],
    ['Americanah', 'Chimamanda Ngozi Adichie'],
  ],
};

async function main() {
  for (const [name, books] of Object.entries(catalog)) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: {
        name,
        books: { create: books.map(([title, author]) => ({ title, author })) },
      },
    });
  }
  console.log('Seeded genres and books');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
