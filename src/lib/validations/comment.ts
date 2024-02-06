import * as z from 'zod';

export const CommentValidation = z.object({
	thread: z.string().min(1, {
		message: 'Comment must not be emtpy',
	}),
})