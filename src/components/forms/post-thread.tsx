'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.actions';
import { Icons } from '@/components/shared/icons';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useUploadImage } from '@/lib/hooks/use-uploadImage';
import { Input } from "@/components/ui/input";

export default function PostThread({ userId }: { userId: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const {
		previewURL,
		getRootProps,
		getInputProps,
		uploadSelectedImage,
		reset
	} = useUploadImage();

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			content: '',
		}
	});

	async function uploadImageAndCreateThread(values: z.infer<typeof ThreadValidation>) {
		const imgRes = await uploadSelectedImage();

		const thread = await createThread({
			content: values.content,
			imageAttachmentUrl: imgRes ? imgRes[0].url : null,
			authorId: userId,
			path: pathname
		});

		return thread;
	}

	async function onSubmit(values: z.infer<typeof ThreadValidation>) {
		await toast.promise(
			uploadImageAndCreateThread(values),
			{
				loading: 'Creating thread...',
				success: (thread) => {
					if (!thread) throw new Error('Thread not created.');
					reset();
					form.reset();
					router.push('/');
					return (
						'Thread created!'
					)
				},
				error: () => {
					return (
						'Error creating thread. Please try again.'
					)
				},
			}
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col justify-start mt-10"
			>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className='flex flex-col gap-3 w-full'>
							<FormLabel
								className='text-base-semibold text-light-2'
							>
								Content
							</FormLabel>
							<FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
								<Textarea
									{...field}
									className='resize-none'
									rows={10}
									disabled={form.formState.isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{previewURL && (
					<div className='relative overflow-hidden rounded-[12px] h-28 max-w-[8rem] mt-3'>
						<Image
							src={previewURL}
							alt=""
							fill
							className='object-contain rounded-[12px]'
						/>
						<Button
							disabled={form.formState.isSubmitting}
							onClick={() => {
								reset();
							}}
							variant={"ghost"}
							className="h-6 w-6 p-1 absolute top-2 right-2 z-50 rounded-full transform active:scale-75 transition-transform cursor-pointer bg-background " >
							<X />
						</Button>
					</div>
				)}

				{!previewURL && !form.formState.isSubmitting && (
					<div className='h-8 w-8' {...getRootProps()}>
						<Input
							{...getInputProps()}
						/>
						{
							<Icons.image className='h-8 w-8 mt-4 select-none transform active:scale-75 transition-transform cursor-pointer text-white' />
						}
					</div>
				)}

				<Button className='bg-primary-500 mt-8' disabled={form.formState.isSubmitting} type="submit">
					{form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
					{form.formState.isSubmitting ? 'Creating' : 'Post Thread'}
				</Button>
			</form>
		</Form>
	)
}
