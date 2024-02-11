import { db } from "./firebase";
import {
	addDoc,
	setDoc,
	doc,
	documentId,
	collection,
	getDocs,
	orderBy,
	query,
	Timestamp,
	where,
	onSnapshot,
} from "firebase/firestore";
import type { Event, RecordingData } from "../types/event";
import { Dispatch, SetStateAction } from "react";
import { getStorageDownloadURL } from "./storage";

const EVENTS_COLLECTION = "events";
const RECORDINGS_COLLECTION = "recordings";

export function addEvent(
	uid: string,
	eventDate: Timestamp,
	eventType: string,
	title: string,
	company: string,
	audience: string
) {
	addDoc(collection(db, EVENTS_COLLECTION), {
		uid,
		eventDate,
		eventType,
		title,
		company,
		audience,
	});
}

export async function getEvent(uid: string, docId: string) {
	const eventQuery = query(
		collection(db, EVENTS_COLLECTION),
		where("uid", "==", uid),
		where(documentId(), "==", docId)
	);

	const eventSnapshot = await getDocs(eventQuery);

	const event: Event[] = [];
	for (const docSnapshot of eventSnapshot.docs) {
		event.push(docSnapshot.data() as Event);
	}

	return event;
}

export function updateEvent(
	docId: string,
	uid: string,
	eventDate: Timestamp,
	eventType: string,
	title: string,
	company: string,
	audience: string
) {
	setDoc(doc(db, EVENTS_COLLECTION, docId), {
		uid,
		eventDate,
		eventType,
		title,
		company,
		audience,
	});
}

export async function getEvents(
	uid: string,
	setEvents: Dispatch<SetStateAction<Event[]>>,
	setIsLoading: Dispatch<SetStateAction<boolean>>
) {
	const eventsQuery = query(
		collection(db, EVENTS_COLLECTION),
		where("uid", "==", uid),
		orderBy("eventDate", "desc")
	);

	const unsubscribe = onSnapshot(eventsQuery, async (snapshot) => {
		let allEvents = [];

		for (const docSnapshot of snapshot.docs) {
			allEvents.push({
				...docSnapshot.data(),
				subcollectionId: docSnapshot.id,
			});
		}

		setEvents(allEvents as Event[]);
		setIsLoading(false);
	});

	return unsubscribe;
}

export async function getRecordings(
	uid: string,
	eventDocId: string,
	setData: Dispatch<SetStateAction<RecordingData[]>>,
	setIsLoading: Dispatch<SetStateAction<boolean>>
) {
	const recordingsQuery = query(
		collection(db, RECORDINGS_COLLECTION),
		where("uid", "==", uid),
		where("eventDocId", "==", eventDocId),
		orderBy("dateCreated", "desc")
	);

	const unsubscribe = onSnapshot(recordingsQuery, async (snapshot) => {
		let allRecordings = [];

		for (const docSnapshot of snapshot.docs) {
			const data = docSnapshot.data();
			allRecordings.push({
				...data,
				subcollectionId: docSnapshot.id,
				audioSrc: await getStorageDownloadURL(data["fileBucket"]),
			});
		}

		setData(allRecordings as RecordingData[]);
		setIsLoading(false);
	});

	return unsubscribe;
}

export async function getRecording(uid: string, recordingDocId: string) {
	const recordingQuery = query(
		collection(db, RECORDINGS_COLLECTION),
		where("uid", "==", uid),
		where(documentId(), "==", recordingDocId)
	);

	const querySnapshot = await getDocs(recordingQuery);
	let recording = [];

	for (const docSnapshot of querySnapshot.docs) {
		const data = docSnapshot.data();
		recording.push({
			...data,
			audioSrc: await getStorageDownloadURL(data["fileBucket"]),
		} as RecordingData);
	}

	return recording;
}

export function addRecordingData(
	uid: string,
	eventDocId: string,
	dateCreated: Timestamp,
	title: string,
	description: string,
	transcript: string,
	score: number,
	analysis: string,
	fileBucket: string
) {
	addDoc(collection(db, RECORDINGS_COLLECTION), {
		uid,
		eventDocId,
		dateCreated,
		title,
		fileBucket,
		description,
		transcript,
		score,
		analysis,
	});
}
