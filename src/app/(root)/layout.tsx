import { ClerkProvider, SignedIn } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Topbar from '@/components/shared/topbar'
import LeftSidebar from '@/components/shared/leftsidebar'
import RightSidebar from '@/components/shared/rightsidebar'
import Bottombar from '@/components/shared/bottombar'
import ThemeContextProvider from '@/context/theme-context'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Knots',
	description: 'A social network application in which users can share their thoughts and connect with others. Built with Next.js, MongoDB, Prisma, and Clerk.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<SignedIn>
				<html lang="en">
					<ThemeContextProvider>
						<body className={`${inter.className}`}>
							<Topbar />
							<main className='flex flex-row'>
								<LeftSidebar />
								<section className='main-container'>
									<div className='w-full h-full max-w-4xl'>
										{children}
									</div>
								</section>
								<RightSidebar />
							</main>
							<Bottombar />
							<Toaster position={'top-right'} />
						</body>
					</ThemeContextProvider>
				</html>
			</SignedIn>
		</ClerkProvider>
	)
}
