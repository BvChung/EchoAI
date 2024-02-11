"use client";

import { useEffect, useState } from "react";
import { SidePanel } from "@/components/sidePanel/SidePanel";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { uploadFile } from "../../../../../firebase/storage";
import { getRecordings } from "../../../../../firebase/firestore";
import { addRecordingData } from "../../../../../firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import type { RecordingData } from "../../../../../types/event";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { AssemblyAI } from "assemblyai";
import { getEvent } from "../../../../../firebase/firestore";
import { askForAnalyzation } from "../../../../../firebase/firebaseLLM";
import type { Event } from "../../../../../types/event";
import { extractNumber, extractScoreAndAnalysis } from "@/utils/extractNumber";
import { getColor } from "@/utils/getScoreColor";

const ERROR_MESSAGE = "Error processing data.";

const assemblyai = new AssemblyAI({
	apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY as string,
});

export default function Page(params: { id: string }) {
	const [open, setOpen] = useState(false);
	const [currEvent, setCurrEvent] = useState<Event>();
	const [data, setData] = useState<RecordingData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { authUser } = useAuth();
	const { id: eventId } = useParams();

	function togglePanel() {
		setOpen((prev) => !prev);
	}

	useEffect(() => {
		const fetchData = async () => {
			if (authUser) {
				const unsubscribe = await getRecordings(
					authUser?.uid!,
					eventId as string,
					setData,
					setIsLoading
				);

				setIsLoading(false);

				return () => {
					unsubscribe();
				};
			}
		};

		fetchData();
	}, [authUser, eventId]);

	useEffect(() => {
		const fetchEventData = async () => {
			if (authUser) {
				const eventData = await getEvent(authUser?.uid!, eventId as string);
				setCurrEvent(eventData[0]);
			}
		};

		fetchEventData();
	}, [authUser, eventId]);

	function handleError() {
		setIsLoading(false);
		toast.update("uploadRecording", {
			render: ERROR_MESSAGE,
			type: "error",
			isLoading: false,
			autoClose: 3000,
			draggable: true,
			closeOnClick: true,
		});
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setIsLoading(true);
		toast.loading("Processing recording ...", {
			type: "info",
			toastId: "uploadRecording",
		});

		const formRef = e.currentTarget as HTMLFormElement;
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const file = formData.get("audio-file") as File;
		const eventDocId = eventId as string;

		if (!title || !description || !file) {
			toast.error("All fields are required");
			return;
		}

		if (!authUser) {
			toast.error("You must be logged in to create an event");
			return;
		}

		let bucket = "";
		let transcript = "";

		try {
			const { text } = await assemblyai.transcripts.transcribe({
				audio: file,
			});

			if (!text) {
				handleError();
				return;
			}

			transcript = text;
		} catch (error) {
			setIsLoading(false);
			return;
		}

		try {
			const uploadedBucket = await uploadFile(file, authUser?.uid);
			bucket = uploadedBucket;
		} catch (error) {
			handleError();
			return;
		}

		const prompt = `You are an ${currEvent?.eventType.toLowerCase()} assistant. I want you to help me prepare for an upcoming ${currEvent?.eventType.toLowerCase()} event with ${
			currEvent?.company
		}. I need you to be as honest and subjective as possible to help me. I want you to rate this content I have prepared from 0 to 100 based on performance, clarity, passion and persuasiveness. The content is below. Return the number value as format Score: . The explanation why the score was given and how to improve, I want one paragraph max five sentences with no new lines and returned as plain text as Analysis: . \n
		Content: ${transcript}
		`;

		let LLMresponse = "";

		try {
			LLMresponse = (await askForAnalyzation(authUser?.uid!, prompt)) as string;
			console.log(LLMresponse);
		} catch (error) {
			handleError();
			return;
		}

		// const score = extractNumber(LLMresponse as string);
		const { score, analysis } = extractScoreAndAnalysis(LLMresponse as string);

		try {
			addRecordingData(
				authUser?.uid,
				eventDocId,
				Timestamp.now(),
				title,
				description,
				transcript,
				score,
				analysis,
				bucket
			);
		} catch (error) {
			handleError();
			return;
		}

		setIsLoading(false);

		toast.update("uploadRecording", {
			render: "Recording uploaded successfully.",
			type: "success",
			isLoading: false,
			autoClose: 3000,
			draggable: true,
			closeOnClick: true,
		});

		if (formRef) {
			formRef.reset();
		}
	}

	return (
		<div className="text-neutral-200 p-12">
			<div className="flex items-center justify-between mb-8 border-b border-b-border pb-4">
				<div className="">
					<h1 className="text-3xl font-semibold text-neutral-100 mb-2">
						{currEvent?.title}
					</h1>

					<p className="font-medium text-neutral-300">
						Scheduled on {currEvent?.eventDate.toDate().toLocaleDateString()}
					</p>
				</div>

				<button
					onClick={togglePanel}
					className="self-start flex items-center py-2 px-4 rounded-md no-underline bg-indigo-500 hover:bg-indigo-600 text-sm font-medium transition-colors"
				>
					<PlusIcon className="w-5 h-5 mr-1" />
					Add Recording
				</button>
			</div>

			<div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
				{data.map((recording, index) => {
					const date = recording.dateCreated.toDate().toLocaleDateString();

					return (
						<Link
							href={`/dashboard/events/${eventId}/${recording.subcollectionId}`}
							key={index}
							className={`flex flex-col rounded-md border bg-cardColor hover:bg-neutral-800 border-inputBorder p-4 shadow-md transition-all h-36`}
						>
							<div className="flex justify-between items-center text-4xl font-medium mb-4">
								<p className={`${getColor(recording.score)}`}>
									{recording.score}
								</p>

								<ChevronRightIcon className="h-5 w-5 " />
							</div>

							<div className="flex gap-1 flex-1 text-sm">
								<p className="font-medium">{recording.title}</p>|
								<p className="font-medium text-sm">{date}</p>
							</div>
						</Link>
					);
				})}
			</div>

			<SidePanel open={open} setOpen={setOpen}>
				<h1 className="text-3xl font-semibold text-neutral-100 mb-8">
					Upload Recording
				</h1>

				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-7">
						<div className="max-w-3xl">
							<label
								htmlFor="title"
								className="block text-sm font-medium leading-6 text-neutral-300"
							>
								Title
							</label>
							<div className="relative mt-2 rounded-md shadow-sm">
								<input
									type="text"
									name="title"
									id="title"
									className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
									placeholder="First Recording Attempt"
									required
								/>
							</div>
						</div>
						<div className="max-w-3xl">
							<label
								htmlFor="description"
								className="block text-sm font-medium leading-6 text-neutral-300"
							>
								Description
							</label>
							<div className="mt-2">
								<textarea
									id="description"
									name="description"
									rows={3}
									className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
									defaultValue={""}
									placeholder="A brief description about the recording and what you tried."
								/>
							</div>
						</div>

						<div className="max-w-3xl">
							<label
								htmlFor=""
								className="block text-sm font-medium leading-6 text-neutral-300"
							>
								Audio File
							</label>
							<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-500 px-6 py-10">
								<div className="text-center">
									<MicrophoneIcon
										className="mx-auto h-8 w-8 text-gray-300"
										aria-hidden="true"
									/>
									<div className="mt-4 mb-2 flex items-center justify-center text-sm leading-6 text-gray-600">
										<label
											htmlFor="audio-file"
											className="relative cursor-pointer rounded-md bg-inputBG px-6 py-5 font-semibold text-secondaryText "
										>
											<span className="">Upload a file</span>
											<input
												type="file"
												name="audio-file"
												id="audio-file"
												accept="audio/*"
												className="mt-2 cursor-pointer block w-full text-sm text-secondaryText
												file:mr-4 file:py-2 file:px-4
												file:rounded-md file:border-0
												file:text-sm file:font-semibold
												file:bg-inputBorder file:text-neutral-200
												file:cursor-pointer "
											/>
										</label>
									</div>
									<p className="text-xs leading-5 text-gray-400">
										PNG, JPG, GIF up to 10MB
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-8 flex items-center justify-end max-w-3xl">
						<button
							type="submit"
							disabled={isLoading}
							className="py-2 px-4 flex rounded-md no-underline disabled:bg-gray-700 disabled:bg-opacity-25 disabled:cursor-not-allowed bg-mainButton hover:bg-mainButtonHover text-sm font-medium"
						>
							Save
						</button>
					</div>
				</form>
			</SidePanel>
		</div>
	);
}
