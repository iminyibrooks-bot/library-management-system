
## Schema Decisions

Book references Genre through a `genreId` foreign key (with `@relation`) instead of embedding genre data inside each book. A genre is a shared entity: many books belong to one genre, so storing it once means renaming "Sci-Fi" is a single update rather than a rewrite of every book. It also prevents typos and inconsistent spellings, lets the database enforce that every book points to a real genre, and makes queries like "all books in a genre" a simple indexed lookup. Embedding would duplicate the same data across hundreds of rows and let copies drift out of sync.

## Stretch: Review model

`Review` links a `User` to a `Book` through `bookId` and `userId` foreign keys, with a unique constraint so one user can leave only one review per book. Deleting a book or user cascades to their reviews.

### Prisma vs. a document database

In a document database like MongoDB, I would have embedded reviews inside each book document and never thought about the shape up front. In Prisma, the relationships are declared explicitly in the schema, and Postgres enforces them: a review can't point to a book that doesn't exist, and changing the model means writing a migration instead of just saving a differently shaped document. It felt more rigid at first, but it caught structural mistakes early.
