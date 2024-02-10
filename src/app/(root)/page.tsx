import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ThreadsList from "./threads-list";
import { Suspense } from "react";
import { Icons } from "@/components/shared/icons";

export default async function Page() {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect('/onboarding');

	return (
		<div className="h-full">
			<h1 className='head-text text-left'>
				Home
			</h1>

			<Suspense fallback={
				<div className='flex items-center justify-center h-full'>
					<Icons.loading className='h-11 w-11' />
				</div>
			}>
				<ThreadsList currentUserId={userInfo.id} />
			</Suspense>
		</div>
	)
}
