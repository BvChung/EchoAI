"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

type AuthUserContextType = {
	authUser: AuthUser | null;
	isLoading: boolean;
	clearCredentials: () => void;
};

type AuthUser = {
	uid: string;
	email: string;
};

const AuthUserContext = createContext({} as AuthUserContextType);

export function useFirebaseAuth() {
	const [authUser, setAuthUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const clearCredentials = () => {
		setAuthUser(null);
		setIsLoading(false);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoading(true);

			if (!user) {
				clearCredentials();
				return;
			}

			setAuthUser({
				uid: user.uid,
				email: user.email ? user.email : "",
			});

			setIsLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return { authUser, isLoading, clearCredentials };
}

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
	const auth = useFirebaseAuth();

	return (
		<AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
	);
}

export const useAuth = () => useContext(AuthUserContext);
