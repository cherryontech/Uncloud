'use client';
import { useEffect, useState, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { UserContext } from '../context/user';
import { auth } from '@/app/firebase';

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const listen = onAuthStateChanged(auth, (fireBaseUser) => {
			if (fireBaseUser) {
				console.log(
					fireBaseUser,
					fireBaseUser.displayName,
					fireBaseUser.closedConfirmationMessage
				);
				setUser(fireBaseUser);
			} else {
				setUser(null);
			}
		});
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}
