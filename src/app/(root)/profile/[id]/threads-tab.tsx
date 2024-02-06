import { fetchUserReplies, fetchUserThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/thread-card";

interface Props {
	id: string;
	clerk_id: string;
	tab: string;
}

export default async function ThreadsTab({ id, clerk_id, tab }: Props) {
	let threads;
	if (tab === 'threads') threads = await fetchUserThreads(id);
	else if (tab === 'replies') threads = await fetchUserReplies(id);

	if (!threads) return null;

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{threads.map((thread) => (
				<ThreadCard
					key={thread.id}
					id={thread.id}
					currentUserId={clerk_id}
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
