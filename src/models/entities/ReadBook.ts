import { Book } from './Book.ts';
import { ReadBookSchema, type ReadBookProps } from '../schemas/book.schema.ts';

export class ReadBook extends Book {
  private rating: number;
  private review: string | null;

  private constructor(props: ReadBookProps) {
    const { rating, review, ...baseProps } = props;

    super(baseProps);

    this.rating = rating;
    this.review = review;
  }

  static create(data: unknown) {
    const validatedProps = ReadBookSchema.parse(data);

    return new ReadBook(validatedProps);
  }
}
