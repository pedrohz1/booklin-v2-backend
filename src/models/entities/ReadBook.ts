import { Book } from './Book.ts';
import { ReadBookSchema, type ReadBookProps } from '../schemas/book.schema.ts';

export class ReadBook extends Book {

  private constructor(protected props: ReadBookProps) {
    super(props);

    this.props.rating = props.rating;
    this.props.review = props.review;
  }

  static create(data: unknown) {
    const validatedProps = ReadBookSchema.parse(data);

    return new ReadBook(validatedProps);
  }

  public get id() {
    return this.props.id;
  }

  public get rating() {
    return this.props.rating;
  }

  public get review() {
    return this.props.review;
  }
}
