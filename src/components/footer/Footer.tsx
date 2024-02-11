"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<footer className="w-full border-t border-t-border p-8 flex justify-center text-center text-xs">
				<p>
					Powered by{" "}
					<a
						href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
						target="_blank"
						className="font-bold hover:underline"
						rel="noreferrer"
					>
						Supabase
					</a>
				</p>
			</footer>
		);
	}
}
