'use server'

import prisma from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function toggleReaction({
	threadId,
	userId,
	type,
	path,
}: {
	threadId: string;
	userId: string;
	type: string;
	path: string;
}) {
	try {
		const existingReaction = await prisma.reaction.findFirst({
			where: {
				threadId,
				userId,
			}
		});

		if (existingReaction) {
			await prisma.reaction.delete({
				where: {
					id: existingReaction.id
				}
			});
			revalidatePath(path);
			return false;
		} else {
			await prisma.reaction.create({
				data: {
					type,
					user: {
						connect: {
							id: userId
						}
					},
					thread: {
						connect: {
							id: threadId
						}
					},
				}
			});

			revalidatePath(path);
			return true;
		}

	} catch (error: any) {
		console.log(`Failed to add reaction: ${error.message}`);
	}
}

export async function checkIfLiked(threadId: string, userId: string) {
	try {
		const existingReaction = await prisma.reaction.findFirst({
			where: {
				threadId,
				userId,
			}
		});

		return existingReaction ? true : false;
	} catch (error: any) {
		console.log(`Failed to check reaction: ${error.message}`);
	}
}

export async function fetchReactionCount(threadId: string) {
	try {
		const reactionCount = await prisma.reaction.count({
			where: {
				threadId,
			}
		});

		return reactionCount;
	} catch (error: any) {
		console.log(`Failed to fetch reaction count: ${error.message}`);
	}
}
