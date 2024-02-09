"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
	id: string;
	username: string;
	imageUrl: string;
	bio: string;
	showViewButton?: boolean;
}

export default function UserCard({ id, username, imageUrl, bio, showViewButton = true }: Props) {
	const router = useRouter();

	return (
		<article className='user-card'>
			<div className='user-card_avatar'>
				<div className='relative h-12 w-12'>
					<Image
						src={imageUrl}
						alt='user_logo'
						fill
						className='rounded-full object-cover'
					/>
				</div>

				<div className='flex-1 text-ellipsis'>
					<Link
						href={`/profile/${id}`}
					>
						<h4 className='text-base-semibold text-light-1'>@{username}</h4>
					</Link>

					<p className='text-small-medium text-gray-1'>{bio}</p>
				</div>

			</div>

			{showViewButton && <Button
				className='user-card_btn'
				onClick={() => {
					router.push(`/profile/${id}`);
				}}
			>
				View
			</Button>}
		</article>
	);
}