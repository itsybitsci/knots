import { useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useUploadThing } from '@/lib/use-upload-thing';

export function useUploadImage() {
	const { startUpload } = useUploadThing('media');
	const [previewURL, setPreviewURL] = useState<string | undefined>(undefined);
	const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

	const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
		if (fileRejections.length > 0) return;

		const acceptedFile = acceptedFiles[0];
		const previewURL = URL.createObjectURL(acceptedFile);
		setPreviewURL(previewURL);
		setSelectedFile(acceptedFile);
	};

	const onDropRejected = (fileRejections: FileRejection[]) => {
		toast.error(fileRejections[0].errors[0].message);
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		onDropRejected,
		accept: {
			'image/jpeg': [],
			'image/png': [],
		},
		maxFiles: 1,
		maxSize: 4 * 1024 * 1024,
		multiple: false,
	});

	async function uploadSelectedImage() {
		let imgRes = null;
		if (selectedFile !== undefined) {
			imgRes = await startUpload([selectedFile]);
		};

		return imgRes as {
			name: string;
			size: number;
			key: string;
			serverData: {
				uploadedBy: string;
			};
			url: string;
		}[] | undefined;
	}

	function reset() {
		setSelectedFile(undefined);
		setPreviewURL('');
	}

	return {
		previewURL, setPreviewURL,
		selectedFile, setSelectedFile,
		getRootProps,
		getInputProps,
		uploadSelectedImage,
		reset
	}
}