'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import * as z from 'zod';
import Image from 'next/image';
import { useState } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/use-upload-thing';
import { createUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';

interface AccountProfileProps {
	userData: {
		id: string | undefined,
		clerk_id: string,
		username: string,
		first_name: string,
		last_name: string,
		email_address: string,
		bio: string,
		image: string,
	},
	btnTitle: string,
}

export default function AccountProfile({ userData, btnTitle }: AccountProfileProps) {
	const [files, setFiles] = useState<File[]>([]);
	const { startUpload } = useUploadThing('media');
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			profile_photo: userData?.image ? userData.image : '',
			bio: userData?.bio ? userData.bio : '',
		}
	});

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
		e.preventDefault();

		const fileReader = new FileReader();

		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setFiles(Array.from(e.target.files));

			if (!file.type.includes('image')) return;

			fileReader.onload = async (event) => {
				const imageDataURL = event?.target?.result?.toString() || '';
				onChange(imageDataURL);
			}

			fileReader.readAsDataURL(file);
		}
	}

	async function onboard(values: z.infer<typeof UserValidation>) {
		const blob = values.profile_photo;
		const hasImageChanged = isBase64Image(blob);
		if (hasImageChanged) {
			const imgRes = await startUpload(files);

			if (imgRes && imgRes[0].url) {
				values.profile_photo = imgRes[0].url;
			}
		}

		const user = await createUser({
			clerk_id: userData.clerk_id,
			username: userData.username,
			first_name: userData.first_name,
			last_name: userData.last_name,
			bio: values.bio,
			email_address: userData.email_address,
			imageUrl: values.profile_photo,
			onboarded: true,
			path: pathname,
		});

		return user;
	}

	async function onSubmit(values: z.infer<typeof UserValidation>) {
		await toast.promise(
			onboard(values),
			{
				loading: 'Onboarding...',
				success: (user) => {
					if (!user) throw new Error('User not created.');
					router.replace('/');
					return (
						'Onboarded!'
					)
				},
				error: () => {
					return (
						'Error onboarding. Please try again.'
					)
				},
			}
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col justify-start gap-10"
			>
				<FormField
					control={form.control}
					name="profile_photo"
					render={({ field }) => (
						<FormItem className='flex items-center gap-4'>
							<FormLabel
								className='account-form_image-label'
							>
								{field.value ? (
									<Image
										src={field.value}
										alt='profile photo'
										width={96}
										height={96}
										priority
										className='rounded-full object-contain'
									/>
								) : (
									<Image
										src={'/assets/profile.svg'}
										alt='profile photo'
										width={24}
										height={24}
										priority
										className='object-contain'
									/>
								)}
							</FormLabel>
							<FormControl className='flex-1 text-base-semibold text-gray-200'>
								<Input
									disabled={form.formState.isSubmitting}
									type='file'
									accept='image/*'
									placeholder='Upload a photo'
									className='account-form_image-input'
									onChange={(e) => handleImageUpload(e, field.onChange)}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem className='flex flex-col gap-3 w-full'>
							<FormLabel
								className='text-base-semibold text-light-2'
							>
								Bio
							</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={form.formState.isSubmitting}
									rows={10}
									className='account-form_input no-focus resize-none'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className='bg-primary-500' disabled={form.formState.isSubmitting} type="submit">
					{form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
					{form.formState.isSubmitting ? 'Please wait' : btnTitle}
				</Button>
			</form>
		</Form>
	)
}

