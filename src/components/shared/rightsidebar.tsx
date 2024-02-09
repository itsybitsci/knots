import { getSuggestedUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/user-card";

export default async function RightSidebar() {
	const user = await currentUser();
	if (!user) return null;

	const suggestUsers = await getSuggestedUsers(5, user.id);

	return (
		<section className='custom-scrollbar rightsidebar'>
			<div className='flex flex-1 flex-col justify-start'>
				<h3 className='text-heading4-medium text-light-1'>
					Suggested Users
				</h3>
				<div className='mt-9 flex flex-col gap-9'>
					{suggestUsers && suggestUsers.map((user) => {
						return (
							<UserCard
								key={user.id}
								id={user.clerk_id}
								username={user.username}
								imageUrl={user.imageUrl}
								bio={user.bio}
								showViewButton={false}
							/>
						)
					})}
				</div>
			</div>
		</section>
	)
}
