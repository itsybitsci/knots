import AccountProfile from '@/components/forms/account-profile'
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';

export default async function Page() {
	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (userInfo?.onboarded) redirect("/");

	const userData = {
		id: userInfo?.id,
		clerk_id: user.id,
		username: userInfo ? userInfo?.username : user.username ?? "",
		first_name: userInfo ? userInfo?.first_name : user.firstName ?? "",
		last_name: userInfo ? userInfo?.last_name : user.lastName ?? "",
		email_address: userInfo ? userInfo.email_address : user.emailAddresses[0].emailAddress ?? "",
		bio: userInfo ? userInfo?.bio : "",
		image: userInfo ? userInfo?.imageUrl : user.imageUrl,
	}

	return (
		<main className='flex flex-col w-full items-center px-10 py-20'>
			<h1 className='head-text'>Onboarding</h1>
			<p className='mt-3 text-base-regular text-light-2'>
				Complete your profile now to use Threads.
			</p>

			<section className='mt-9 bg-dark-2 p-10'>
				<AccountProfile
					userData={userData}
					btnTitle='Continue'
				/>
			</section>
		</main>
	)
}
