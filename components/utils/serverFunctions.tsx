'use server';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { formatDateToYYYYMMDD } from './reusableFunctions';

export async function updateUser(uid: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	updateDoc(userDocRef, {
		closedConfirmationMessage: true,
	});
}
export async function addUserMood(uid: string, mood: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	const userDocSnap = await getDoc(userDocRef);
	console.log(userDocSnap);

	if (userDocSnap.exists()) {
		const userData = userDocSnap.data();
		if (userData) {
			const today = formatDateToYYYYMMDD(new Date()); // Get today's date in YYYY-MM-DD format

			// Initialize 'moods' array if it doesn't exist initially
			const moodsArray = userData.moods || [];

			const existingMoodIndex = moodsArray.findIndex(
				(moodEntry: any) => moodEntry.date === today
			);

			if (existingMoodIndex !== -1) {
				// If mood entry for today exists, update it
				moodsArray[existingMoodIndex].mood = mood;
			} else {
				// If mood entry for today doesn't exist, append a new entry
				moodsArray.push({ date: today, mood: mood });
			}
			console.log(moodsArray);

			// Update the document with the modified moods array
			await updateDoc(userDocRef, { moods: moodsArray });
		}
	}
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
