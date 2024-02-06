import Image from "next/image";
import UpdateProfile from "@/components/forms/update-profile";

interface Props {
	userClerkId: string
	username: string;
	imgUrl: string;
	bio: string;
}

export default function ProfileHeader({
	userClerkId,
	username,
	imgUrl,
	bio,
}: Props) {


	return (
		<div className='flex w-full flex-col justify-start'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='relative h-20 w-20 object-cover'>
						<Image
							src={imgUrl}
							alt='logo'
							fill
							className='rounded-full object-cover shadow-2xl'
						/>
					</div>

					<div className='flex-1'>
						<h2 className='text-left text-heading3-bold text-light-1'>
							@{username}
						</h2>
					</div>
				</div>
				<UpdateProfile userClerkId={userClerkId} bio={bio} />
			</div>

			<p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

			<div className='mt-12 h-0.5 w-full bg-dark-3' />
		</div>
	);
}
