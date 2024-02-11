import { Timestamp } from "assemblyai";
import { db } from "./firebase";
import {
	addDoc,
	collection,
	documentId,
	query,
	where,
	orderBy,
	onSnapshot,
	limit,
	doc,
	setDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

const DISCUSSIONS_COLLECTION = "discussions";

export type LLMMessage = {
	createTime: Timestamp;
	prompt: string;
	response: string;
	uid: string;
	status: {
		completeTime: Timestamp;
		startTime: Timestamp;
		state: string;
		updateTime: Timestamp;
	};
};

export async function askForAnalyzation(uid: string, prompt: string) {
	const docRef = await addDoc(collection(db, DISCUSSIONS_COLLECTION), {
		uid,
		prompt,
	});

	const response = await new Promise((resolve, reject) => {
		const unsubscribe = onSnapshot(docRef, (doc) => {
			const status = doc.get("status");
			console.log(doc);
			if (status && status.error === "ERROR") {
				unsubscribe();
				reject("Error in processing.");
			} else {
				const response = doc.get("response");
				if (response) {
					console.log("RESPONSE:" + response);
					unsubscribe();
					resolve(response);
				}
			}
		});
	});

	return response;
}

export async function addMessage(uid: string, prompt: string) {
	await addDoc(collection(db, DISCUSSIONS_COLLECTION), {
		uid,
		prompt,
	});
}

export async function createMessage() {
	await setDoc(doc(db, "discussions", "chat"), {
		prompt: "Hello!",
	});
}

export function createConversation(
	setConversation: Dispatch<SetStateAction<LLMMessage[]>>
) {
	const unsubscribe = onSnapshot(doc(db, "discussions", "chat"), (snapshot) => {
		setConversation((prev) => [...prev, snapshot.data() as LLMMessage]);
	});

	return unsubscribe;
}
