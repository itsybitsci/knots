import { fetchUserReplies, fetchUserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/thread-card";

interface Props {
	userId: string;
	currentUserClerkId: string;
	currentUserId: string;
	tab: string;
}

export default async function ThreadsTab({ userId, currentUserClerkId, currentUserId, tab }: Props) {
	let threads;
	if (tab === 'threads') threads = await fetchUserThreads(userId);
	else if (tab === 'replies') threads = await fetchUserReplies(userId);

	if (!threads) return null;

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{threads.map((thread) => (
				<ThreadCard
					key={thread.id}
					id={thread.id}
					currentUseClerkrId={currentUserClerkId}
					currentUserId={currentUserId}
					parentId={thread.parentThreadId}
					content={thread.content}
					imageAttachmentUrl={thread.imageAttachmentUrl}
					author={thread.author}
					createdAt={thread.created_at.toString()}
					comments={thread.replies}
					inProfilePage
				/>
			))}
		</section>
	);
}
