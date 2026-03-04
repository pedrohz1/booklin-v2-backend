import { UserSchema, type UserProps } from "../schemas/user.schema.ts";

export class User {

    private constructor(private props: UserProps) {
        this.props.id = crypto.randomUUID().toString();
    }

    static create(data: unknown) {
        const validatedProps = UserSchema.parse(data);

        return new User(validatedProps);
    }

    public get username() {
        return this.props.username;
    }

    public get id() {
        return this.props.id;
    }

    public get password() {
        return this.props.password;
    }

    public get profilePicture() {
        return this.props.profilePicture;
    }
}