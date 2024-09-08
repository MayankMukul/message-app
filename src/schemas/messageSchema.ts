import {z} from 'zod';

export const messageSchema = z.object({
    content : z
    .string()
    .min(10, { message: 'Content must be 10 character long' })
    .max(300, { message: 'Content must be at most 300 characters'})
})