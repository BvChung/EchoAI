import { Timestamp } from "firebase/firestore";

export type Event = {
	uid: string;
	subcollectionId?: string;
	eventDate: Timestamp;
	eventType: string;
	title: string;
	company: string;
	audience: string;
};

export type RecordingData = {
	uid: string;
	eventDocId: string;
	dateCreated: Timestamp;
	title: string;
	fileBucket: string;
	description: string;
	transcript: string;
	score: number;
	analysis: string;
	subcollectionId?: string;
	audioSrc: any;
};
