'use client'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CommentValidation } from "@/lib/validations/comment";
import { Icons } from "@/components/shared/icons";
import { X } from 'lucide-react';
import { Textarea } from "../ui/textarea";
import { replyToThread } from "@/lib/actions/thread.actions";
import { useUploadImage } from "@/lib/hooks/use-uploadImage";
import { ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface CommentProps {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

export default function Comment({ threadId, currentUserImg, currentUserId }: CommentProps) {
	const pathname = usePathname();
	const {
		previewURL,
		getRootProps,
		getInputProps,
		uploadSelectedImage,
		reset
	} = useUploadImage();

	const form = useForm<z.infer<typeof CommentValidation>>({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: "",
		},
	});

	async function uploadImageAndCreateThread(values: z.infer<typeof CommentValidation>) {
		const imgRes = await uploadSelectedImage();

		const thread = await replyToThread({
			threadId,
			content: values.thread,
			imageAttachmentUrl: imgRes ? imgRes[0].url : null,
			authorId: currentUserId,
			pathname
		});

		return thread;
	}

	async function onSubmit(values: z.infer<typeof CommentValidation>) {
		await toast.promise(
			uploadImageAndCreateThread(values),
			{
				loading: 'Posting reply...',
				success: (thread) => {
					if (!thread) throw new Error('Thread not created.');
					reset();
					form.reset();
					return (
						'Replied!'
					)
				},
				error: () => {
					return (
						'Error posting reply. Please try again.'
					)
				},
			}
		);
	};

	return (
		<Form {...form}>
			<form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex w-full items-center gap-3'>
							<FormLabel>
								<Image
									src={currentUserImg}
									alt='current_user'
									width={48}
									height={48}
									className='rounded-full object-cover'
								/>
							</FormLabel>
							<div className="flex flex-col w-full">
								<FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
									<Textarea
										{...field}
										className='resize-none'
										rows={2}
										disabled={form.formState.isSubmitting}
									/>
								</FormControl>
								<FormMessage />

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
									<div className='h-8 w-8 mb-3' {...getRootProps()}>
										<Input
											{...getInputProps()}
										/>
										{
											<Icons.image className='h-8 w-8 mt-4 select-none transform active:scale-75 transition-transform cursor-pointer text-white' />
										}
									</div>
								)}
							</div>
						</FormItem>
					)}
				/>

				<Button disabled={form.formState.isSubmitting} type='submit' className='comment-form_btn flex items-start'>
					{form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
					{form.formState.isSubmitting ? 'Posting' : 'Reply'}
				</Button>
			</form>
		</Form>
	);
}
