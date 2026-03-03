import { UserSchema, type UserProps } from "../schemas/user.schema.ts";

export class User {

    private id: string;
    private username: string;
    private password: string;
    private profilePicture: string | null;

    private constructor(props: UserProps) {
        this.id = crypto.randomUUID().toString();
        this.username = props.username;
        this.password = props.password;

        this.profilePicture = props.profilePicture ?? null;
    }

    static create(data: unknown) {
        const validatedProps = UserSchema.parse(data);

        return new User(validatedProps);
    }
}