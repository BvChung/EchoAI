"use client";

import Link from "next/link";
import { BoltIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../../firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { useRouter } from "next/navigation";

export default function Navigation() {
	const { authUser, clearCredentials } = useAuth();
	const router = useRouter();

	async function signOutUser() {
		await signOut(auth);
		clearCredentials();
		router.push("/");
	}

	return (
		<nav className="w-full justify-between items-center h-16 sticky top-0 text-white bg-main border-b border-b-border z-10 px-6">
			<div className="flex h-16 justify-between items-center gap-6">
				<Link href={"/"} className="flex items-center gap-2">
					<BoltIcon className="h-7 w-7 fill-secondaryText" />
					<p className="font-bold">EchoAI</p>
				</Link>

				{authUser ? (
					<button
						className="py-2 px-4 flex rounded-md no-underline bg-mainButton hover:bg-mainButtonHover text-xs font-medium"
						onClick={signOutUser}
					>
						<p className="text-xs font-medium">Sign out</p>
					</button>
				) : (
					<Link
						href="/sign-in"
						className="py-2 px-4 flex rounded-md no-underline bg-mainButton hover:bg-mainButtonHover text-xs font-medium"
					>
						Sign in
					</Link>
				)}
			</div>
		</nav>
	);
}
