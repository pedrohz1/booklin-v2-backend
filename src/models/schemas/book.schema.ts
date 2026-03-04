import { z } from 'zod';

const BookSchema = z.object({
    id: z.uuid().optional(),
    title: z.string().min(1).max(150),
    cover: z.url(),
    author: z.string().min(1),
    userId: z.uuid(),
    description: z.string().max(3000).nullable().default(null)
})

export const DesiredBookSchema = BookSchema.extend({
    link: z.url()
}) 

export const ReadBookSchema = BookSchema.extend({
    rating: z.number().min(0).max(5),
    review: z.string().nullable().default(null)
})

export type BookProps = z.infer<typeof BookSchema>;
export type DesiredBookProps = z.infer<typeof DesiredBookSchema>;
export type ReadBookProps = z.infer<typeof ReadBookSchema>