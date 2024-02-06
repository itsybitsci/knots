import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import ActivitiesList from "./activities-list";
import { Suspense } from "react";
import { Icons } from "@/components/shared/icons";

export default async function Page() {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect("/onboarding");

	return (
		<section className="h-full">
			<h1 className='head-text'>Activity</h1>

			<Suspense fallback={
				<div className='flex items-center justify-center h-full'>
					<Icons.loading className='h-11 w-11' />
				</div>
			}>
				<ActivitiesList id={userInfo.id} />
			</Suspense>
		</section>
	);
}
