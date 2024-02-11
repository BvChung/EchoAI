"use client";

import Link from "next/link";
import {
	Squares2X2Icon,
	PencilSquareIcon,
	CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function SideBar() {
	const pathname = usePathname();

	function isActiveLink(link: string, pathname: string, mainDirectory: string) {
		if (link === pathname && pathname === mainDirectory) {
			return true;
		} else if (pathname.includes(link) && link !== mainDirectory) {
			return true;
		} else {
			return false;
		}
	}

	const navLinks = [
		{
			href: "/dashboard",
			icon: <Squares2X2Icon className="h-6 w-6 mr-1" />,
			name: "Dashboard",
		},
		{
			href: "/dashboard/create",
			icon: <PencilSquareIcon className="h-6 w-6 mr-1" />,
			name: "Create",
		},
		{
			href: "/dashboard/events",
			icon: <CalendarDaysIcon className="h-6 w-6 mr-1" />,
			name: "Events",
		},
	];

	return (
		<div className="w-52 min-w-52 h-screen">
			<div className="pr-6 py-6 mt-16 fixed top-0 h-screen w-52 min-w-52 border-r border-r-border">
				<ul className="flex flex-col gap-3 transition-all text-sm">
					{navLinks.map((link, index) => {
						return (
							<li key={index}>
								<Link
									href={link.href}
									className={` ${
										isActiveLink(link.href, pathname, "/dashboard")
											? "border-l-4 border-l-secondaryText text-white rounded-l-none"
											: "border-l-4 border-l-transparent text-gray-400"
									} flex gap-2 items-center hover:text-white pl-6 p-2 rounded-md`}
								>
									{link.icon}
									<p className="font-semibold text-sm">{link.name}</p>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
