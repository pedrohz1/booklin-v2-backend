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
      await pool.execute(
        `SELECT BIN_TO_UUID(b.id) as id, b.title, b.cover, b.author, 
              BIN_TO_UUID(b.userId) as userId, b.description, d.link 
       FROM books b
       JOIN desired_books d ON b.id = d.id
       WHERE b.id = UUID_TO_BIN(?)`,
        [id]
      );

    const book = rows[0];
    return book ? DesiredBook.create(book) : null;
  }

  async findAllByUserId(userId: string): Promise<DesiredBook[] | null> {
    const [rows]: [DesiredBookDatabaseRow[], FieldPacket[]] =
      await pool.execute(
        `SELECT BIN_TO_UUID(b.id) as id, b.title, b.cover, b.author, 
              BIN_TO_UUID(b.userId) as userId, b.description, d.link 
       FROM books b
       JOIN desired_books d ON b.id = d.id
       WHERE b.userId = UUID_TO_BIN(?)`,
        [userId]
      );

    if (rows.length === 0) return null;
    return rows.map((row) => DesiredBook.create(row));
  }

  async save(book: DesiredBook) {
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
        `INSERT INTO desired_books (id, link) VALUES (UUID_TO_BIN(?), ?)`,
        [book.id!, book.link]
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
