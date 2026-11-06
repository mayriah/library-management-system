import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Safely cleanup existing data for idempotency
  await prisma.review.deleteMany().catch(() => {});
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  const genreNames = ["Fantasy", "Science Fiction", "Mystery", "Biography"];
  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      }),
    ),
  );

  const sampleBooks = [
    // Fantasy (4 books)
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      isbn: "9780547928227",
      description: "A reluctant hobbit sets out on a quest to win a share of a dragon's hoard.",
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      genre: "Fantasy",
      isbn: "9780756404741",
      description: "The tale of Kvothe, a legendary wizard and musician.",
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      genre: "Fantasy",
      isbn: "9780553103540",
      description: "Noble houses fight for control of the Iron Throne of Westeros.",
      totalCopies: 6,
      availableCopies: 5,
    },
    {
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      genre: "Fantasy",
      isbn: "9780765326355",
      description: "Roshar is a world of stone and storms where powerful warriors face an ancient enemy.",
      totalCopies: 3,
      availableCopies: 2,
    },

    // Science Fiction (4 books)
    {
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      isbn: "9780441172719",
      description: "Paul Atreides leads nomadic tribes on a harsh desert planet rich with spice melange.",
      totalCopies: 5,
      availableCopies: 3,
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      genre: "Science Fiction",
      isbn: "9780441569595",
      description: "A washed-up computer hacker is hired for one last job targeting a powerful AI.",
      totalCopies: 3,
      availableCopies: 2,
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      genre: "Science Fiction",
      isbn: "9780553293357",
      description: "Hari Seldon uses psychohistory to preserve knowledge through an impending galactic dark age.",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Science Fiction",
      isbn: "9780593135204",
      description: "A lone astronaut must find a way to save Earth from an extinction-level event.",
      totalCopies: 4,
      availableCopies: 3,
    },

    // Mystery (4 books)
    {
      title: "The Big Sleep",
      author: "Raymond Chandler",
      genre: "Mystery",
      isbn: "9780394758282",
      description: "Private investigator Philip Marlowe is hired to resolve a wealthy family's blackmail case.",
      totalCopies: 3,
      availableCopies: 2,
    },
    {
      title: "The Hound of the Baskervilles",
      author: "Arthur Conan Doyle",
      genre: "Mystery",
      isbn: "9780140437867",
      description: "Sherlock Holmes investigates the myth of a demonic hound stalking the Devonshire moors.",
      totalCopies: 5,
      availableCopies: 5,
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      genre: "Mystery",
      isbn: "9780062073488",
      description: "Ten strangers on an isolated island are eliminated one by one according to a nursery rhyme.",
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      genre: "Mystery",
      isbn: "9780307588364",
      description: "A husband becomes the prime suspect when his wife disappears on their fifth wedding anniversary.",
      totalCopies: 4,
      availableCopies: 1,
    },

    // Biography (4 books)
    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Biography",
      isbn: "9780399590504",
      description: "A woman raised by survivalists in rural Idaho enters the classroom for the first time at 17.",
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      genre: "Biography",
      isbn: "9781451648539",
      description: "The definitive biography of the creative entrepreneur whose passion revolutionized tech.",
      totalCopies: 3,
      availableCopies: 2,
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      genre: "Biography",
      isbn: "9781524763138",
      description: "An intimate and inspiring memoir by the former First Lady of the United States.",
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      genre: "Biography",
      isbn: "9780553296983",
      description: "The moving diary of a teenage Jewish girl in hiding in Amsterdam during the Nazi occupation.",
      totalCopies: 6,
      availableCopies: 5,
    },
  ];

  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    if (!genre) continue;

    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        genreId: genre.id,
      },
    });
  }

  console.log(
    `Database successfully seeded with ${genres.length} genres and ${sampleBooks.length} books.`,
  );
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

