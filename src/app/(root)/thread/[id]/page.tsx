import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/comment";
import { Suspense } from "react";
import ParentThread from "@/app/(root)/thread/[id]/parent-thread";
import { Icons } from "@/components/shared/icons";
import Replies from "./replies";

export default async function Page({ params }: { params: { id: string } }) {
	if (!params.id) return null;

	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect('/onboarding');

	return (
		<section>
			<Suspense fallback={
				<div className='flex items-center justify-center h-full'>
					<Icons.loading className='h-11 w-11' />
				</div>
			}>
				<ParentThread threadId={params.id} userId={user.id} />
			</Suspense>

			<div className='mt-7'>
				<Comment
					threadId={params.id}
					currentUserImg={userInfo.imageUrl}
					currentUserId={userInfo.id}
				/>
			</div>

			<Suspense fallback={
				<div className='flex items-center justify-center h-full'>
					<Icons.loading className='h-11 w-11' />
				</div>
			}>
				<Replies threadId={params.id} userId={user.id} />
			</Suspense>
		</section>
	)
}
