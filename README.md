
## Schema Decisions

Book references Genre through a `genreId` foreign key (with `@relation`) instead of embedding genre data inside each book. A genre is a shared entity: many books belong to one genre, so storing it once means renaming "Sci-Fi" is a single update rather than a rewrite of every book. It also prevents typos and inconsistent spellings, lets the database enforce that every book points to a real genre, and makes queries like "all books in a genre" a simple indexed lookup. Embedding would duplicate the same data across hundreds of rows and let copies drift out of sync.
