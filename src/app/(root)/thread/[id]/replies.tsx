import ThreadCard from '@/components/cards/thread-card';
import { fetchRepliesByThreadId } from '@/lib/actions/thread.actions';
import { redirect } from 'next/navigation';

export default async function Replies(
	{
		threadId,
		currentUseClerkrId,
		currentUserId,
	}: {
		threadId: string;
		currentUseClerkrId: string;
		currentUserId: string;
	}
) {
	const threads = await fetchRepliesByThreadId(threadId);
	if (!threads) redirect('/');

	return (
		<div className='mt-10'>
			{threads.map((thread) => (
				<ThreadCard
					key={thread.id}
					id={thread.id}
					currentUseClerkrId={currentUseClerkrId}
					currentUserId={currentUserId}
					parentId={thread.parentThreadId}
					content={thread.content}
					imageAttachmentUrl={thread.imageAttachmentUrl}
					author={thread.author}
					createdAt={thread.created_at.toISOString()}
					comments={thread.replies}
					isComment
				/>
			))}
		</div>
	)
}
