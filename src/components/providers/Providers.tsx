"use client";

import { AuthUserProvider } from "../../../firebase/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
	return <AuthUserProvider>{children}</AuthUserProvider>;
}
