import { getReplyNotifications } from '@/lib/actions/user.actions';
import Image from 'next/image';
import Link from 'next/link';

export default async function ActivitiesList({ id }: { id: string }) {
	const activity = await getReplyNotifications(id);
	if (!activity) return null;

	return (
		<section className='mt-10 flex flex-col gap-5'>
			{activity.length > 0 ? (
				<>
					{activity.map((activity) => (
						<Link key={activity.id} href={`/thread/${activity.parentThreadId}`}>
							<article className='activity-card'>
								<Image
									src={activity.author.imageUrl}
									alt='user_logo'
									width={20}
									height={20}
									className='rounded-full object-cover'
								/>
								<p className='!text-small-regular text-light-1'>
									<span className='mr-1 text-primary-500'>
										{`@${activity.author.username}`}
									</span>{" "}
									replied to your thread
								</p>
							</article>
						</Link>
					))}
				</>
			) : (
				<p className='!text-base-regular text-light-3'>No activity yet</p>
			)}
		</section>
	)
}
