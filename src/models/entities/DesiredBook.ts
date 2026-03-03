import { Book } from "./Book.ts";
import { DesiredBookSchema, type DesiredBookProps } from "../schemas/book.schema.ts";

export class DesiredBook extends Book {
    private link: string;

    private constructor (props: DesiredBookProps) {
        const { link, ...baseProps } = props; 
        
        super(baseProps);

        this.link = link;
    }

    static create(data: unknown) {
        const validatedProps = DesiredBookSchema.parse(data);

        return new DesiredBook(validatedProps);
    }
}