"use client";

import { useAuth } from "../../../firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase/firebase";

export default function Page() {
	const { authUser } = useAuth();

	console.log(authUser);

	return <div className="text-red-600"></div>;
}
