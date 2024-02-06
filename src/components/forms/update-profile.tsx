'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateValidation } from "@/lib/validations/user";
import * as z from 'zod';
import toast from "react-hot-toast";
import { updateUser } from "@/lib/actions/user.actions";
import { useState } from "react";
import useWindow from "@/lib/hooks/use-window";

export default function UpdateProfile({ userClerkId, bio }: { userClerkId: string, bio: string }) {
	const { isMobile } = useWindow()
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(UserUpdateValidation),
		defaultValues: {
			bio: '',
		}
	});

	async function onSubmit(values: z.infer<typeof UserUpdateValidation>) {
		await toast.promise(
			updateUser({
				userId: userClerkId,
				bio: values.bio,
				pathname: `/profile/${userClerkId}`,
			}),
			{
				loading: 'Updating profile...',
				success: (user) => {
					if (!user) throw new Error('Profile not updated.');
					form.reset();
					return (
						'Profile updated!'
					)
				},
				error: () => {
					return (
						'Error updating profile. Please try again.'
					)
				},
			}
		);
	}

	return (
		<Form {...form}>
			<Dialog
				open={open} onOpenChange={setOpen}
			>
				<DialogTrigger asChild>
					<Button variant="outline" className="gap-2 dark:text-white dark:bg-dark-2 border-none">
						<Icons.create className="h-5 w-5" />
						Edit
					</Button>
				</DialogTrigger>

				<DialogContent className="sm:max-w-[425px] dark:bg-dark-1 border border-black">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col justify-start mt-2"
					>
						<DialogHeader>
							<DialogTitle className="dark:text-white">Edit Bio</DialogTitle>
							<DialogDescription>
								Make changes to your bio here.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className=" items-center gap-4">
								<FormField
									control={form.control}
									name="bio"
									render={({ field }) => (
										<FormItem className='flex flex-col gap-3 w-full'>
											<FormLabel
												className='text-base-semibold dark:text-light-2 text-black'
											>
												Bio
											</FormLabel>
											<FormControl className='no-focus bg-gray-100 border border-gray-300 dark:bg-dark-3 text-black dark:text-light-1'>
												<Textarea
													{...field}
													className='resize-none'
													placeholder={bio}
													rows={isMobile ? 5 : 10}
													disabled={form.formState.isSubmitting}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit"
								onClick={() => setOpen(false)}
							>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	)
}
