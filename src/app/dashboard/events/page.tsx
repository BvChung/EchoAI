"use client";

import { useEffect, useState, useCallback } from "react";
import { getEvents } from "../../../../firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../../../../firebase/auth";
import { type Event } from "../../../../types/event";

function calculateDays(formattedDate: string): number {
	const today = new Date();
	const eventDate = new Date(formattedDate);

	const diffInTime = eventDate.getTime() - today.getTime();

	const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

	return diffInDays;
}

export default function Page() {
	const { authUser } = useAuth();

	const [events, setEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (authUser) {
				const unsubscribe = await getEvents(
					authUser?.uid!,
					setEvents,
					setIsLoading
				);

				return () => {
					unsubscribe();
				};
			}
		};

		fetchData();
	}, [authUser]);

	return (
		<div className="text-neutral-200 p-12">
			<h1 className="text-3xl font-semibold text-neutral-100 mb-10">Events</h1>

			<div className="flex flex-col gap-3 max-w-5xl">
				{events.map((evnt, indx) => {
					const formattedDate = evnt.eventDate.toDate().toLocaleDateString();

					return (
						<Link
							href={`/dashboard/events/${evnt.subcollectionId}`}
							key={indx}
							className="flex items-center rounded-md border bg-cardColor hover:bg-neutral-800 border-inputBorder p-4 shadow-md"
						>
							<CalendarIcon className="h-6 w-6 mr-3" />

							<div className="flex items-center flex-1 justify-between">
								<p className="font-medium">{evnt.title}</p>
								<p className="font-medium text-sm">
									Occurs in {calculateDays(formattedDate)} days
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
