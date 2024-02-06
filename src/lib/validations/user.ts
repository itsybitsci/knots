import * as z from 'zod';

export const UserValidation = z.object({
	profile_photo: z.string().min(1).url(),
	bio: z.string().max(1000),
});

export const UserUpdateValidation = z.object({
	bio: z.string().max(1000),
});