"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Datepicker from "react-tailwindcss-datepicker";
import { addEvent } from "../../../../firebase/firestore";
import { useAuth } from "../../../../firebase/auth";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";

export default function Page() {
	const [eventDate, setEventDate] = useState({
		startDate: null,
		endDate: null,
	});
	const { authUser } = useAuth();
	const router = useRouter();

	const handleDateChange = (newValue: any) => {
		setEventDate(newValue);
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formRef = e.currentTarget as HTMLFormElement;
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const title = formData.get("title") as string;
		const type = formData.get("type") as string;
		const company = formData.get("company") as string;
		const audience = formData.get("audience") as string;

		if (!type || !company || !audience || !eventDate.startDate || !title) {
			toast.error("All fields are required");
			return;
		}

		const date = new Date(eventDate.startDate);
		const timestamp = Timestamp.fromDate(date);

		if (!authUser) {
			toast.error("You must be logged in to create an event");
			router.push("/sign-in");
			return;
		}

		try {
			addEvent(authUser?.uid, timestamp, type, title, company, audience);
			toast.success("Event created successfully");
		} catch (error) {
			toast.error("Error creating event");
		}

		setEventDate({ startDate: null, endDate: null });

		if (formRef) {
			formRef.reset();
		}
	}

	return (
		<div className="text-neutral-200 p-12">
			<h1 className="text-3xl font-semibold text-neutral-100">Create Event</h1>
			<form onSubmit={handleSubmit}>
				<div className="space-y-12">
					<div className="">
						<div className="mt-10 flex flex-col gap-6">
							<div className="max-w-3xl">
								<label
									htmlFor="title"
									className="block text-sm font-medium leading-6 text-neutral-400"
								>
									Event Title
								</label>
								<div className="relative mt-2 rounded-md shadow-sm">
									<input
										type="text"
										name="title"
										id="title"
										className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
										placeholder="Interview with Company X"
										required
									/>
								</div>
							</div>

							<div className="max-w-3xl">
								<label
									htmlFor="date"
									className="block text-sm font-medium leading-6 text-neutral-400"
								>
									Event Date
								</label>
								<div className="mt-2 max-w-3xl">
									<Datepicker
										asSingle={true}
										inputClassName="bg-inputBG w-full max-w-3xl rounded-md py-1.5 px-3 border border-inputBorder placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors text-neutral-100"
										value={eventDate}
										onChange={handleDateChange}
										popoverDirection="down"
									/>
								</div>
							</div>

							<div className="max-w-3xl">
								<label
									htmlFor="type"
									className="block text-sm font-medium leading-6 text-neutral-400"
								>
									Event Type
								</label>
								<div className="relative mt-2 rounded-md shadow-sm">
									<input
										type="text"
										name="type"
										id="type"
										className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
										placeholder="Interview"
										required
									/>
								</div>
							</div>

							<div className="max-w-3xl">
								<label
									htmlFor="company"
									className="block text-sm font-medium leading-6 text-neutral-400"
								>
									Company
								</label>
								<div className="relative mt-2 rounded-md shadow-sm">
									<input
										type="text"
										name="company"
										id="company"
										className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
										placeholder="Google"
										required
									/>
								</div>
							</div>

							<div className="max-w-3xl">
								<label
									htmlFor="audience"
									className="block text-sm font-medium leading-6 text-neutral-400"
								>
									Audience
								</label>
								<div className="relative mt-2 rounded-md shadow-sm">
									<input
										type="text"
										name="audience"
										id="audience"
										className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
										placeholder="Recruiter"
										required
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 flex items-center justify-end max-w-3xl">
					<button
						type="submit"
						className="py-2 px-4 flex rounded-md no-underline bg-mainButton hover:bg-mainButtonHover text-sm font-medium"
					>
						Save
					</button>
				</div>
			</form>
		</div>
	);
}
