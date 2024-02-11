"use client";

import React from "react";
import SideBar from "@/components/sideBar/SideBar";
import { useEffect } from "react";
import { useAuth } from "../../../firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { authUser, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !authUser) {
			router.push("/sign-in");
		}
	}, [authUser, isLoading, router]);

	if (isLoading || !authUser) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex">
			<SideBar />
			<div className="flex-1">{children}</div>
		</div>
	);
}
