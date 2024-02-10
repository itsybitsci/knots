'use client';

import { toggleReaction } from '@/lib/actions/reaction.action';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function LikeButton({ threadId, userId, reactionCount, initialIsLiked }: { threadId: string, userId: string, reactionCount: number, initialIsLiked: boolean }) {
	const pathname = usePathname();
	const [isLiked, setIsLiked] = useState(initialIsLiked);

	return (
		<div className='flex flex-row  items-center'>
			<Image
				onClick={async () => {
					const value = await toggleReaction({ threadId, userId, type: 'like', path: pathname });
					setIsLiked(value ?? false);
				}}
				src={isLiked ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
				alt='heart'
				width={24}
				height={24}
				className='cursor-pointer object-contain'
			/>
			{reactionCount > 0 && <p className='text-subtle-medium text-gray-1'>{reactionCount}</p>}
		</div>
	)
}
