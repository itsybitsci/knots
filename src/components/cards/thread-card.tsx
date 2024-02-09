import Link from "next/link";
import Image from "next/image";
import DeleteThread from "@/components/forms/delete-thread";
import ThreadTimestamp from "@/components/shared/thread-timestamp";

interface ThreadCardProps {
	id: string;
	currentUserId: string;
	parentId: string | null;
	content: string;
	imageAttachmentUrl: string | null;
	author: {
		id: string;
		clerk_id: string;
		username: string;
		imageUrl: string;
	},
	createdAt: string;
	comments: {
		author: {
			imageUrl: string;
		},
	}[] | null,
	isComment?: boolean;
	inProfilePage?: boolean;
}

export default function ThreadCard({
	id,
	currentUserId,
	parentId,
	content,
	imageAttachmentUrl,
	author,
	createdAt,
	comments,
	isComment,
	inProfilePage,
}: ThreadCardProps) {
	return (
		<article
			className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
				}`}
		>
			<div className='flex items-start justify-between'>
				<div className='flex w-full flex-1 flex-row gap-4'>
					<div className='flex flex-col items-center'>
						<Link href={`/profile/${author.clerk_id}`} className='relative h-11 w-11'>
							<Image
								src={author.imageUrl}
								alt='user_image'
								fill
								className='cursor-pointer rounded-full'
							/>
						</Link>

						<div className='thread-card_bar' />
					</div>

					<div className='flex w-full flex-col'>
						<Link href={`/profile/${author.clerk_id}`} className='w-fit'>
							<h4 className='cursor-pointer text-base-semibold text-light-1'>
								@{author.username}
							</h4>
						</Link>

						<p className='mt-2 text-small-regular text-light-2'>{content}</p>

						{imageAttachmentUrl && (
							<div className='relative rounded-[12px] h-28 max-w-[8rem] mt-3'>
								<Image
									src={imageAttachmentUrl}
									alt="attachment"
									fill
									className='object-contain rounded-[12px]'
								/>
							</div>
						)}

						<div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
							<div className='flex gap-3.5'>
								<Image
									src='/assets/heart-gray.svg'
									alt='heart'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/>
								<Link href={`/thread/${inProfilePage && parentId ? parentId : id}`}>
									<Image
										src='/assets/reply.svg'
										alt='heart'
										width={24}
										height={24}
										className='cursor-pointer object-contain'
									/>
								</Link>
								<Image
									src='/assets/repost.svg'
									alt='heart'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/>
								<Image
									src='/assets/share.svg'
									alt='heart'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/>
							</div>

							{isComment && comments && comments.length > 0 && (
								<div className='mt-1 flex items-center gap-2'>
									{comments.slice(0, 2).map((comment, index) => (
										<Image
											key={index}
											src={comment.author.imageUrl}
											alt={`user_${index}`}
											width={24}
											height={24}
											className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
										/>
									))}
									<Link href={`/thread/${id}`}>
										<p className='mt-1 text-subtle-medium text-gray-1'>
											{comments.length} repl{comments.length > 1 ? "ies" : "y"}
										</p>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>

				<DeleteThread
					threadId={id}
					currentUserId={currentUserId}
					authorId={author.clerk_id}
				/>
			</div>

			{!isComment && comments && comments.length > 0 && (
				<div className='ml-1 mt-3 flex items-center gap-2'>
					{comments.slice(0, 2).map((comment, index) => (
						<Image
							key={index}
							src={comment.author.imageUrl}
							alt={`user_${index}`}
							width={24}
							height={24}
							className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
						/>
					))}

					<Link href={`/thread/${id}`}>
						<p className='mt-1 text-subtle-medium text-gray-1'>
							{comments.length} repl{comments.length > 1 ? "ies" : "y"}
						</p>
					</Link>
				</div>
			)}

			<ThreadTimestamp createdAt={createdAt} />
		</article>
	)
}
