'use server'

import prisma from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function createThread({
	content,
	imageAttachmentUrl,
	authorId,
	path
}: {
	content: string;
	imageAttachmentUrl: string | null;
	authorId: string;
	path: string;
}) {
	try {
		const createdThread = await prisma.thread.create({
			data: {
				content,
				imageAttachmentUrl,
				author: {
					connect: {
						id: authorId
					}
				}
			}
		});

		revalidatePath(path);
		return createdThread;
	} catch (error: any) {
		console.log(`Failed to create thread: ${error.message}`);
	}
}

export async function fetchThreads(
	pageNumber: number = 1,
	pageSize: number = 20,
) {
	try {
		const skipAmount = (pageNumber - 1) * pageSize;

		const threads = await prisma.thread.findMany({
			where: {
				parentThreadId: {
					isSet: false
				}
			},
			orderBy: {
				created_at: 'desc'
			},
			include: {
				author: {
					select: {
						id: true,
						clerk_id: true,
						username: true,
						imageUrl: true,
					}
				},
				replies: {
					select: {
						author: {
							select: {
								imageUrl: true,
							}
						}
					}
				}
			},
			skip: skipAmount,
			take: pageSize,
		});

		const totalThreadsCount = threads.length;

		const isNext = totalThreadsCount > skipAmount + threads.length;

		return { threads, isNext };
	}
	catch (error: any) {
		console.log(`Failed to fetch threads: ${error.message}`);
	}
}

export async function fetchThreadById(threadId: string) {
	try {
		const thread = await prisma.thread.findFirst({
			where: {
				id: threadId
			},
			include: {
				author: {
					select: {
						id: true,
						clerk_id: true,
						username: true,
						imageUrl: true,
					}
				}
			}
		});

		return thread;
	} catch (error: any) {
		console.log(`Failed to fetch thread: ${error.message}`);
	}
}

export async function fetchRepliesByThreadId(threadId: string) {
	try {
		const replies = await prisma.thread.findMany({
			where: {
				parentThreadId: threadId
			},
			include: {
				author: {
					select: {
						id: true,
						clerk_id: true,
						username: true,
						imageUrl: true,
					}
				},
				replies: {
					select: {
						author: {
							select: {
								imageUrl: true,
							}
						}
					}
				}
			}
		});

		return replies;
	} catch (error: any) {
		console.log(`Failed to fetch replies: ${error.message}`);
	}
}

export async function replyToThread({
	threadId,
	content,
	imageAttachmentUrl,
	authorId,
	pathname,
}: {
	threadId: string;
	content: string;
	imageAttachmentUrl: string | null;
	authorId: string;
	pathname: string;
}) {
	try {
		const reply = await prisma.thread.create({
			data: {
				content,
				imageAttachmentUrl,
				author: {
					connect: {
						id: authorId
					}
				},
				parentThread: {
					connect: {
						id: threadId
					}
				}
			}
		});

		revalidatePath(pathname);
		return reply;
	} catch (error: any) {
		console.log(`Failed to reply to thread: ${error.message}`);
	}
}

export async function fetchUserThreads(userId: string) {
	try {
		const threads = await prisma.thread.findMany({
			where: {
				authorId: userId,
				parentThreadId: {
					isSet: false
				}
			},
			orderBy: {
				created_at: 'desc'
			},
			include: {
				author: {
					select: {
						id: true,
						clerk_id: true,
						username: true,
						imageUrl: true,
					}
				},
				replies: {
					select: {
						author: {
							select: {
								imageUrl: true,
							}
						}
					}
				}
			}
		});

		return threads;
	} catch (error: any) {
		console.log(`Failed to fetch user threads: ${error.message}`);
	}
}

export async function recursivelyDeleteChildThreads(parentThreadId: string) {
	try {
		const childThreads = await prisma.thread.findMany({
			where: {
				parentThreadId
			}
		});

		for (const childThread of childThreads) {
			await recursivelyDeleteChildThreads(childThread.id);
			await prisma.thread.delete({
				where: {
					id: childThread.id
				}
			});
		}
	} catch (error: any) {
		console.log(`Failed to recursively delete child threads: ${error.message}`);
	}
}

export async function deleteThread(threadId: string, pathname: string) {
	try {
		await recursivelyDeleteChildThreads(threadId);
		const thread = await prisma.thread.delete({
			where: {
				id: threadId
			}
		});

		revalidatePath(pathname);
		return thread;
	} catch (error: any) {
		console.log(`Failed to delete thread: ${error.message}`);
	}
}

export async function getUserThreadsCount(userId: string) {
	try {
		const threadsCount = await prisma.thread.count({
			where: {
				authorId: userId,
				parentThreadId: {
					isSet: false
				}
			}
		});

		return threadsCount;
	} catch (error: any) {
		console.log(`Failed to get user threads count: ${error.message}`);
	}
}

export async function getUserRepliesCount(userId: string) {
	try {
		const repliesCount = await prisma.thread.count({
			where: {
				authorId: userId,
				parentThreadId: {
					isSet: true
				}
			}
		});

		return repliesCount;
	} catch (error: any) {
		console.log(`Failed to get user replies count: ${error.message}`);
	}
}

export async function fetchUserReplies(userId: string) {
	try {
		const threads = await prisma.thread.findMany({
			where: {
				authorId: userId,
				parentThreadId: {
					isSet: true
				}
			},
			orderBy: {
				created_at: 'desc'
			},
			include: {
				author: {
					select: {
						id: true,
						clerk_id: true,
						username: true,
						imageUrl: true,
					}
				},
				replies: {
					select: {
						author: {
							select: {
								imageUrl: true,
							}
						}
					}
				}
			}
		});

		return threads;
	} catch (error: any) {
		console.log(`Failed to fetch user threads: ${error.message}`);
	}
}