"use client";

import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Page() {
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			toast.error("Email and password are required");
			return;
		}

		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long.");
			return;
		}

		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);

			if (!res) {
				toast.error("Invalid credentials.");
				return;
			}

			router.push("/dashboard");
		} catch (error) {
			toast.error(error as string);
			console.log(error);
		}
	}

	return (
		<div className="flex items-center justify-center py-36">
			<div className="w-full max-w-96">
				<div className="font-medium mb-8">
					<p className="text-xl mb-2">Get started</p>
					<p className="text-sm text-neutral-400">Create a new account</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mt-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium leading-6 text-neutral-400"
						>
							Email
						</label>
						<div className="relative mt-2 rounded-md shadow-sm">
							<input
								type="text"
								name="email"
								id="email"
								className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
								placeholder="you@example.com"
								required
							/>
						</div>
					</div>

					<div className="mt-4">
						<label
							htmlFor="password"
							className="block text-sm font-medium leading-6 text-neutral-400"
						>
							Password
						</label>
						<div className="relative mt-2 rounded-md shadow-sm">
							<input
								type="password"
								name="password"
								id="password"
								className="block w-full rounded-md py-1.5 px-3 bg-inputBG border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
								placeholder="••••••••"
								required
							/>
						</div>
					</div>

					<button className="w-full bg-mainButton mt-8 rounded-md border border-mainButtonBorder hover:bg-mainButtonHover py-2 transition-colors text-neutral-300">
						Sign up
					</button>
				</form>

				<Link
					href="/sign-in"
					className="text-center mt-5 block text-sm text-neutral-400 hover:underline"
				>
					Already have an account?
				</Link>
			</div>
		</div>
	);
}
