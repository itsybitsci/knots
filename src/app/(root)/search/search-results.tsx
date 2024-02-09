import { searchForUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import UserCard from "@/components/cards/user-card";
import Pagination from "@/components/shared/pagination";

export default async function SearchResults({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const user = await currentUser();
	if (!user) return null;

	const result = await searchForUsers({
		userId: user.id,
		searchString: searchParams.q,
		pageNumber: searchParams?.page ? +searchParams.page : 1,
		pageSize: 25,
	});

	return (
		<>
			<div className='mt-9 flex flex-col gap-9'>
				{result?.users.length === 0 ? (
					<p className='no-result'>No Result</p>
				) : (
					<>
						{result?.users.map((user) => {
							return (
								<UserCard
									key={user.id}
									id={user.clerk_id}
									username={user.username}
									imageUrl={user.imageUrl}
									bio={user.bio}
								/>
							)
						})}
					</>
				)}
			</div>

			<Pagination
				path='search'
				pageNumber={searchParams?.page ? +searchParams.page : 1}
				isNext={result!.isNext}
			/>
		</>
	)
}
