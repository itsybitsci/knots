import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
	const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
	return base64Regex.test(imageData);
}

export function formatDateString(dateString: string) {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	const date = new Date(dateString);
	const formattedDate = date.toDateString();
	const time = date.toTimeString();
	const formattedTime = moment(time, 'HH:mm:ss Z').format('hh:mm A');
	return `${formattedTime} - ${formattedDate}`;
}

export function formatThreadCount(count: number): string {
	if (count === 0) {
		return "No Threads";
	} else {
		const threadCount = count.toString().padStart(2, "0");
		const threadWord = count === 1 ? "Thread" : "Threads";
		return `${threadCount} ${threadWord}`;
	}
}