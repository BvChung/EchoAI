"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<footer className="w-full border-t border-t-border p-8 flex justify-center text-center text-xs">
				<p>© EchoAI</p>
			</footer>
		);
	}
}
