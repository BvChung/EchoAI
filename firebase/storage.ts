import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const BUCKET_URL = process.env.NEXT_PUBLIC_CLOUD_BUCKET_URL;

export async function uploadFile(file: File, uid: string) {
	const fileType = file.name.substring(file.name.lastIndexOf("."));

	const formattedDate = new Date().toISOString();
	const bucket = `${BUCKET_URL}/${uid}/${formattedDate}${fileType}`;
	const storageRef = ref(storage, bucket);
	await uploadBytes(storageRef, file);

	return bucket;
}

export async function uploadImage(file: File, uid: string) {
	const formattedDate = new Date().toISOString();
	const bucket = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;
	const storageRef = ref(storage, bucket);
	await uploadBytes(storageRef, file);

	return bucket;
}

export async function getStorageDownloadURL(bucket: string) {
	const storageRef = ref(storage, bucket);

	return await getDownloadURL(storageRef);
}
