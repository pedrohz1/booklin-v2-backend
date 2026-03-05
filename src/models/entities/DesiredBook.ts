import { Book } from './Book.ts';
import {
  DesiredBookSchema,
  type DesiredBookProps,
} from '../schemas/book.schema.ts';

export class DesiredBook extends Book {
  private constructor(protected props: DesiredBookProps) {
    super(props);

    this.props.id = crypto.randomUUID().toString();
    this.props.link = props.link;
  }

  static create(data: unknown) {
    const validatedProps = DesiredBookSchema.parse(data);

    return new DesiredBook(validatedProps);
  }

  public get id() {
    return this.props.id;
  }

  public get link() {
    return this.props.link;
  }
}
