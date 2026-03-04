import type { BookProps } from '../schemas/book.schema.ts';

export abstract class Book {
  protected constructor(protected props: BookProps) {}

  public get title() {
    return this.props.title;
  }

  public get cover() {
    return this.props.cover;
  }

  public get author() {
    return this.props.author;
  }

  public get description() {
    return this.props.description;
  }

  public get userId() {
    return this.props.userId;
  }
}
