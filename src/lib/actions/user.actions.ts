'use server'

import prisma from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function updateUser({
	userId,
	username,
	first_name,
	last_name,
	email_address,
	imageUrl,
	bio,
	pathname,
}: {
	userId: string,
	username?: string,
	first_name?: string,
	last_name?: string,
	email_address?: string,
	imageUrl?: string,
	bio?: string,
	pathname?: string,
}) {
	try {
		const user = await prisma.user.update({
			where: {
				clerk_id: userId
			},
			data: {
				...(username != '' ? { username } : {}),
				...(first_name != '' ? { first_name } : {}),
				...(last_name != '' ? { last_name } : {}),
				...(email_address != '' ? { email_address } : {}),
				...(imageUrl != '' ? { imageUrl } : {}),
				...(bio === null || bio === undefined ? {} : { bio }),
			}
		});

		pathname && revalidatePath(pathname);
		return user;
	} catch (error: any) {
		console.log(`Failed to update user: ${error.message}`);
	}
};

export async function createUser({
	clerk_id,
	username,
	first_name,
	last_name,
	bio,
	email_address,
	imageUrl,
	onboarded,
	path,
}: {
	clerk_id: string;
	username: string;
	first_name: string;
	last_name: string;
	bio: string;
	email_address: string;
	imageUrl: string;
	onboarded: boolean;
	path: string;
}) {
	try {
		const user = await prisma.user.create({
			data: {
				clerk_id,
				username,
				first_name,
				last_name,
				bio,
				email_address,
				imageUrl,
				onboarded,
			}
		});

		return user;
	} catch (error: any) {
		console.log(`Failed to create user: ${error.message}`);
	}
}

export async function fetchUser(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				clerk_id: userId
			}
		});

		return user;
	} catch (error: any) {
		console.log(`Failed to fetch user: ${error.message}`);
	}
}

export async function searchForUsers({
	userId,
	searchString = "",
	pageNumber = 1,
	pageSize = 20,
}: {
	userId: string;
	searchString?: string;
	pageNumber?: number;
	pageSize?: number;
}) {
	try {
		const skipAmount = (pageNumber - 1) * pageSize;

		const users = await prisma.user.findMany({
			where: {
				clerk_id: { not: userId },
				OR: [
					{
						username: {
							contains: searchString,
							mode: 'insensitive'
						}
					},
					{
						first_name: {
							contains: searchString,
							mode: 'insensitive'
						}
					},
					{
						last_name: {
							contains: searchString,
							mode: 'insensitive'
						}
					},
				]
			},
			orderBy: {
				created_at: 'desc'
			},
			skip: skipAmount,
			take: pageSize,
		});

		const totalUsersCount = users.length;

		const isNext = totalUsersCount > skipAmount + users.length;

		return { users, isNext };
	} catch (error: any) {
		console.log(`Failed to search for users: ${error.message}`);
	}
}

export async function getReplyNotifications(userId: string) {
	try {
		const parentThreads = await prisma.thread.findMany({
			where: {
				authorId: userId
			},
			select: {
				id: true
			}
		});

		const replies = await prisma.thread.findMany({
			where: {
				authorId: { not: userId },
				parentThreadId: {
					in: parentThreads.map(parentThread => parentThread.id)
				}
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						imageUrl: true,
					}
				}
			},
			orderBy: {
				created_at: 'desc'
			}
		});

		return replies;
	} catch (error: any) {
		console.log(`Failed to fetch reply notifications: ${error.message}`);
	}
}