'use client'

import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image'
import { useAuth } from "@clerk/nextjs";

export default function Bottombar() {
	const pathname = usePathname();
	const { userId } = useAuth();

	return (
		<section className="bottombar">
			<div className="bottombar_container">
				{sidebarLinks.map((link) => {
					const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
					if (link.route === '/profile') link.route = `/profile/${userId}`;

					return (
						<Link
							className={`bottombar_link ${isActive && 'bg-primary-500'}`}
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

							<p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(' ')[0]}</p>
						</Link>
					)
				})}
			</div>
		</section>
	)
}
