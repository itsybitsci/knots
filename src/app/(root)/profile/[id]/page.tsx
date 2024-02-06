import ProfileHeader from "@/app/(root)/profile/[id]/profile-header";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { profileTabs } from "@/constants";
import ThreadsTab from "@/app/(root)/profile/[id]/threads-tab";
import { Suspense } from "react";
import ThreadsCount from "./threads-count";
import { Icons } from "@/components/shared/icons";

export default async function Page({ params }: { params: { id: string } }) {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(params.id);
	if (!userInfo?.onboarded) redirect('/onboarding');

	return (
		<section>
			<ProfileHeader
				userClerkId={user.id}
				username={userInfo.username}
				imgUrl={userInfo.imageUrl}
				bio={userInfo.bio}
			/>

			<div className='mt-9'>
				<Tabs defaultValue='threads' className='w-full'>
					<TabsList className='tab'>
						{profileTabs.map((tab) => (
							<TabsTrigger key={tab.label} value={tab.value} className='tab'>
								<Image
									src={tab.icon}
									alt={tab.label}
									width={24}
									height={24}
									className='object-contain'
								/>
								<p className='max-sm:hidden'>{tab.label}</p>

								<Suspense fallback={
									<div className='flex items-center justify-center w-fit h-fit'>
										<Icons.loading className='h-5 w-5' />
									</div>
								}>
									<ThreadsCount id={userInfo.id} tab={tab.value} />
								</Suspense>
							</TabsTrigger>
						))}
					</TabsList>
					{profileTabs.map((tab) => (
						<TabsContent
							key={`content-${tab.label}`}
							value={tab.value}
							className='w-full text-light-1'
						>
							<Suspense fallback={
								<div className='flex items-center justify-center w-full h-[55vh]'>
									<Icons.loading className='h-11 w-11' />
								</div>
							}>
								<ThreadsTab
									id={userInfo.id}
									clerk_id={user.id}
									tab={tab.value}
								/>
							</Suspense>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	)
}
