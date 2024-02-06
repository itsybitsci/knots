import { fetchThreads } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/thread-card";
import { currentUser } from "@clerk/nextjs";

export default async function ThreadsList() {
	const user = await currentUser();
	if (!user) return null;

	const data = await fetchThreads();

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{data?.threads.length === 0 ? (
				<p className="no-result">
					No threads found.
				</p>
			) : (
				<>
					{
						data?.threads.map((thread) => (
							<ThreadCard
								key={thread.id}
								id={thread.id}
								currentUserId={user?.id}
								parentId={thread.parentThreadId}
								content={thread.content}
								imageAttachmentUrl={thread.imageAttachmentUrl}
								author={thread.author}
								createdAt={thread.created_at.toISOString()}
								comments={thread.replies}
							/>
						))
					}
				</>
			)}
		</section>
	)
}
