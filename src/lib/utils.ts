import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isBase64Image(imageData: string) {
	const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
	return base64Regex.test(imageData);
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