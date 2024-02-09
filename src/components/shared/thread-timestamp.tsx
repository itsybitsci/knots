'use client';

export default function ThreadTimestamp({ createdAt }: { createdAt: string }) {
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

	return (
		<div className='mt-5 flex items-center'>
			<p className='text-subtle-medium text-gray-1'>
				{formatDateString(createdAt)}
			</p>
		</div>
	)
}
