import ThreadCard from '@/components/cards/thread-card'
import { fetchThreadById } from '@/lib/actions/thread.actions';
import { redirect } from 'next/navigation';

export default async function ParentThread({
	threadId,
	userId,
}: {
	threadId: string;
	userId: string;
}) {
	const thread = await fetchThreadById(threadId);
	if (!thread) redirect('/');

	return (
		<div>
			<ThreadCard
				id={thread.id}
				currentUserId={userId}
				parentId={thread.parentThreadId}
				content={thread.content}
				imageAttachmentUrl={thread.imageAttachmentUrl}
				author={thread.author}
				createdAt={thread.created_at.toISOString()}
				comments={null}
			/>
		</div>
	)
}
