import { getUserRepliesCount, getUserThreadsCount } from "@/lib/actions/thread.actions";

export default async function ThreadsCount({ id, tab }: { id: string, tab: string }) {
	let userThreadsCount;
	if (tab === 'threads') userThreadsCount = await getUserThreadsCount(id);
	else if (tab === 'replies') userThreadsCount = await getUserRepliesCount(id);

	if (!userThreadsCount) return null;
	return (
		<p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
			{userThreadsCount}
		</p>
	)
}
