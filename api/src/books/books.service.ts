import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    await this.ensureGenreExists(dto.genreId);
    try {
      return await this.prisma.book.create({ data: dto });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('ISBN already exists');
      throw e;
    }
  }

  async findAll(query: {
    genreId?: number;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { genreId, search, page, limit } = query;

    const where: Prisma.BookWhereInput = {};
    if (genreId) where.genreId = genreId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    if (dto.genreId) await this.ensureGenreExists(dto.genreId);
    try {
      return await this.prisma.book.update({ where: { id }, data: dto });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('ISBN already exists');
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) throw new NotFoundException('Genre not found');
  }
}
