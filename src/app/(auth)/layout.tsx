import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';


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
			<html lang="en">
				<body className={`${inter.className} bg-dark-1`}>
					{children}
					<Toaster position={'top-right'} />
				</body>
			</html>
		</ClerkProvider>
	)
}