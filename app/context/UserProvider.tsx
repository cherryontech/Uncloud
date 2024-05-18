'use client';
import {
	useEffect,
	useState,
	createContext,
	useContext,
	ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/firebase';

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	updateData: () => void;
	isUpdated: boolean;
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
		<AuthContext.Provider value={{ user, setUser, updateData, isUpdated }}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
}
