import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, GenresModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
