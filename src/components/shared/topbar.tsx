import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

export default function Topbar() {
	return (
		<nav className='topbar'>
			<Link href='/' className='flex items-center gap-4'>
				<Image src='/assets/knots_white.svg' alt='logo' width={28} height={28} />
				<p className='text-heading3-bold text-light-1 max-xs:hidden'>
					Knots
				</p>
			</Link>

			<div className='flex items-center gap-1'>
				<UserButton afterSignOutUrl='/sign-in' />
			</div>
		</nav>
	)
}
