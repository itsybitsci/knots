import * as z from 'zod';

export const ThreadValidation = z.object({
	content: z.string().min(1, {
		message: 'Thread must be at least 1 character',
	}),
})
