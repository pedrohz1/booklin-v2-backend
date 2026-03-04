import { success } from "zod";
import { pool } from "../config/db.ts";
import { User } from "../models/entities/User.ts";
import { type RowDataPacket, type FieldPacket } from "mysql2";

interface UserDatabaseRow extends RowDataPacket {
    id: string,
    username: string,
    password: string,
    profile_picture: string | null;
}

export interface IUserRepository {
    findById(id: string): Promise<User | null>; 
    save(user: User): Promise<Error | any>;
}


export class SqlUserRepository implements IUserRepository {
    async findById(id: string) {
        const [rows]: [UserDatabaseRow[], FieldPacket[]] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);

        const user = rows[0];

        if (!user) {
            return null; 
        }

        return User.create({
            id: user.id,
            username: user.username,
            password: user.password,
            profilePicture: user.profile_picture
        })    
    }   

    async save(user: User) {
        try {
            const [result] = await pool.query('INSERT INTO users (id, username, password, profile_picture) VALUES (?, ?, ?, ?)', 
            [user.id, user.username, user.password, user.profilePicture]);
            return [null, result];
        }
        catch (e) {
            return [e as Error, null];
        }
    }
}