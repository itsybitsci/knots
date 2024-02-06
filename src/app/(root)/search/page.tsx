import { Icons } from "@/components/shared/icons";
import SearchResults from "@/app/(root)/search/search-results";
import Searchbar from "@/components/shared/searchbar";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user?.id);
	if (!userInfo?.onboarded) redirect('/onboarding');

	return (
		<section>
			<h1 className='head-text mb-10'>Search</h1>

			<Searchbar routeType='search' />
			<Suspense fallback={
				<div className='flex items-center justify-center w-full h-[55vh]'>
					<Icons.loading className='h-11 w-11' />
				</div>
			}>
				<SearchResults searchParams={searchParams} />
			</Suspense>
		</section>
	)
}
