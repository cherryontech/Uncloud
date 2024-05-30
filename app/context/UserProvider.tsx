'use client';
import {
	useEffect,
	useState,
	createContext,
	useContext,
	ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/app/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	updateData: () => void;
	isUpdated: boolean;
	refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

interface UserProviderProps {
	children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isUpdated, setIsUpdated] = useState(false);
	const refetchUser = async () => {
		const currentUser = auth.currentUser;
		setLoading(true);
		if (currentUser) {
			const userDocRef = doc(db, 'authUsers', currentUser.uid);
			const userDocSnap = await getDoc(userDocRef);
			if (userDocSnap.exists()) {
				setUser(currentUser); // Set the current user
			}
		} else {
			setUser(null);
		}
		setLoading(false);
	};
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				console.log(firebaseUser, firebaseUser.displayName);
				setUser(firebaseUser);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [isUpdated]);

	const updateData = () => {
		setIsUpdated((prev) => !prev);
	};

	return (
		<AuthContext.Provider
			value={{ user, setUser, updateData, isUpdated, refetchUser }}
		>
			{loading ? null : children}
		</AuthContext.Provider>
	);
}
