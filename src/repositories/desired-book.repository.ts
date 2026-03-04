import type { FieldPacket, RowDataPacket } from 'mysql2';
import { DesiredBook } from '../models/entities/DesiredBook.ts';
import { pool } from '../config/db.ts';

interface DesiredBookDatabaseRow extends RowDataPacket {
  id: string;
  title: string;
  cover: string;
  author: string;
  userId: string;
  description: string | null;
  link: string;
}

export interface IDesiredBookRepository {
  findById(id: string): Promise<DesiredBook | null>;
  findAllByUserId(userId: string): Promise<DesiredBook[] | null>;
  save(book: DesiredBook): Promise<Error | any>;
}

export class SQLDesiredBookRepository implements IDesiredBookRepository {
  async findById(id: string): Promise<DesiredBook | null> {
    const [rows]: [DesiredBookDatabaseRow[], FieldPacket[]] =
      await pool.execute('SELECT * FROM desired_books WHERE id = ?', [id]);

    const book = rows[0];

    if (!book) {
      return null;
    }

    return DesiredBook.create({
      id: z.uuid().optional(),
      title: z.string().min(1).max(150),
      fcover: z.url(),
      author: z.string().min(1),
      userId: z.uuid(),
      description: z.string().max(3000).nullable().default(null),
    });
  }
}
