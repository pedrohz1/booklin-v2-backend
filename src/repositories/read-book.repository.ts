import type { FieldPacket, RowDataPacket } from 'mysql2';
import { ReadBook } from '../models/entities/ReadBook.ts';
import { pool } from '../config/db.ts';

interface ReadBookDatabaseRow extends RowDataPacket {
  id: string;
  title: string;
  cover: string;
  author: string;
  userId: string;
  description: string | null;
  rating: number;
  review: string | null;
}

export interface IReadBookRepository {
  findById(id: string): Promise<ReadBook | null>;
  findAllByUserId(userId: string): Promise<ReadBook[] | null>;
  save(book: ReadBook): Promise<Error | any>;
}

export class SQLReadBookRepository implements IReadBookRepository {
  async findById(id: string): Promise<ReadBook | null> {
    const [rows]: [ReadBookDatabaseRow[], FieldPacket[]] = await pool.execute(
      `SELECT BIN_TO_UUID(b.id) as id, b.title, b.cover, b.author, 
              BIN_TO_UUID(b.userId) as userId, b.description, d.rating, d.review 
       FROM books b
       JOIN read_books d ON b.id = d.id
       WHERE b.id = UUID_TO_BIN(?)`,
      [id]
    );

    const book = rows[0];
    return book ? ReadBook.create(book) : null;
  }

  async findAllByUserId(userId: string): Promise<ReadBook[] | null> {
    const [rows]: [ReadBookDatabaseRow[], FieldPacket[]] = await pool.execute(
      `SELECT BIN_TO_UUID(b.id) as id, b.title, b.cover, b.author, 
              BIN_TO_UUID(b.userId) as userId, b.description, d.rating, d.review 
       FROM books b
       JOIN read_books d ON b.id = d.id
       WHERE b.userId = UUID_TO_BIN(?)`,
      [userId]
    );

    if (rows.length === 0) return null;
    return rows.map((row) => ReadBook.create(row));
  }

  async save(book: ReadBook) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        `INSERT INTO books (id, title, cover, author, userId, description) 
         VALUES (UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?), ?)`,
        [
          book.id!,
          book.title,
          book.cover,
          book.author,
          book.userId,
          book.description,
        ]
      );

      await connection.execute(
        `INSERT INTO read_books (id, rating, review) VALUES (UUID_TO_BIN(?), ?, ?)`,
        [book.id!, book.rating, book.review]
      );

      await connection.commit();
      return [null, true];
    } catch (e) {
      await connection.rollback();
      return [e as Error, null];
    } finally {
      connection.release();
    }
  }
}
