import { z } from 'zod';

export const UserSchema = z.object({
  id: z.uuid().optional(),
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(30),
  profilePicture: z.url().nullable().default(null),
});

export type UserProps = z.infer<typeof UserSchema>;
