import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export function updateUser(uid) {
	const userDocRef = doc(db, 'authUsers', uid);
	updateDoc(userDocRef, {
		closedConfirmationMessage: true,
	});
}

export function getUser(uid) {
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
