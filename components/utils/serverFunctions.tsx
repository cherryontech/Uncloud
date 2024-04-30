'use server';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export async function updateUser(uid: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	updateDoc(userDocRef, {
		closedConfirmationMessage: true,
	});
}

export async function getUser(uid: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	return getDoc(userDocRef)
		.then((userDocSnapshot) => {
			// Extract the custom fields from the document data
			const userData = userDocSnapshot.data();
			console.log(userData);
			return userData;
		})
		.catch((error) => {
			console.error('Error getting user data:', error);
		});
}
