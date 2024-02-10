'use client';

import { useEffect, useState } from "react";

export default function ThreadTimestamp({ createdAt }: { createdAt: string }) {
	const [date, setDate] = useState('');

	function formatDateString(dateString: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};

		const date = new Date(dateString);
		const formattedDate = date.toLocaleDateString([], options);

		const time = date.toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit",
		});

		return `${time} - ${formattedDate}`;
	}

	useEffect(() => {
		setDate(formatDateString(createdAt));
	}, []);

	return (
		<div className='mt-5 flex items-center'>
			<p className='text-subtle-medium text-gray-1'>
				{date}
			</p>
		</div>
	)
}
