'use client'

import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function LeftSidebar() {
	const pathname = usePathname();
	const { userId } = useAuth();

	return (
		<section className='leftsidebar custom-scrollbar'>
			<div className='flex w-full flex-1 flex-col gap-6 px-6'>
				{sidebarLinks.map((link) => {
					const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
					if (link.route === '/profile') link.route = `/profile/${userId}`;

					return (
						<Link
							className={`leftsidebar_link ${isActive && 'bg-primary-500'} ${!isActive && 'hover:bg-gray-900'}`}
							href={link.route}
							key={link.label}
						>
							<Image
								src={link.imgURL}
								alt={link.label}
								width={24}
								height={24}
								className='cursor-pointer'
							/>

							<p className='text-light-1 max-lg:hidden'>{link.label}</p>
						</Link>
					)
				})}
			</div>

			{/* Todo: Add the SignOutButton component to the left sidebar */}
			{/* <div className='mt-10 px-6 '>
				<SignOutButton
					signOutCallback={() => router.push('/sign-in')}
				>
					<div className='flex cursor-pointer gap-4 p-4 rounded-lg hover:bg-gray-900'>
						<Image
							src='/assets/logout.svg'
							alt='logout'
							width={24}
							height={24}
						/>
						<p className='text-light-1 max-lg:hidden'>Logout</p>
					</div>
				</SignOutButton>
			</div> */}
		</section>
	)
}
