"use client";

import { useRouter } from "next/navigation";
import {
	signInWithPopup,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Page() {
	const router = useRouter();

	async function googleSignIn() {
		try {
			const res = await signInWithPopup(auth, new GoogleAuthProvider());

			if (!res) {
				toast.error("Invalid credentials.");
				return;
			}

			router.push("/dashboard");
		} catch (error) {
			console.error(error);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			toast.error("Email and password are required");
			return;
		}

		try {
			const res = await signInWithEmailAndPassword(auth, email, password);

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
				<div className="font-medium mb-12">
					<p className="text-xl mb-2">Welcome back</p>
					<p className="text-sm text-neutral-400">Sign in to your account</p>
				</div>

				<button
					onClick={googleSignIn}
					className="flex items-center justify-center bg-grayButton w-full rounded-md border border-grayButtonOutline hover:bg-grayButtonHover py-2 transition-colors"
				>
					<svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 48 48"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						className="h-6 w-6 fill-current mr-3"
					>
						<path
							fill="#EA4335"
							d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
						></path>
						<path
							fill="#4285F4"
							d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
						></path>
						<path
							fill="#FBBC05"
							d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
						></path>
						<path
							fill="#34A853"
							d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
						></path>
						<path fill="none" d="M0 0h48v48H0z"></path>
					</svg>
					Sign with Google
				</button>

				<div className="relative mt-4">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-border"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 text-sm bg-main">or</span>
					</div>
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
						Sign in
					</button>
				</form>

				<Link
					href="/sign-up"
					className="text-center mt-5 block text-sm text-neutral-400 hover:underline"
				>
					Need to create an account?
				</Link>
			</div>
		</div>
	);
}
