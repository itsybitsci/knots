"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { deleteThread } from "@/lib/actions/thread.actions";
import toast from "react-hot-toast";

interface Props {
	threadId: string;
	currentUserId: string;
	authorId: string;
}

export default function DeleteThread({
	threadId,
	currentUserId,
	authorId,
}: Props) {
	const pathname = usePathname();

	if (currentUserId !== authorId) return null;

	return (
		<Image
			src='/assets/delete.svg'
			alt='delete'
			width={18}
			height={18}
			className='cursor-pointer object-contain'
			onClick={async () => {
				await toast.promise(
					deleteThread(threadId, pathname),
					{
						loading: 'Deleting thread...',
						success: (thread) => {
							if (!thread) throw new Error('Error deleting thread.');
							return (
								'Thread deleted!'
							)
						},
						error: () => {
							return (
								'Error deleting thread. Please try again.'
							)
						},
					}
				);
			}}
		/>
	);
}
