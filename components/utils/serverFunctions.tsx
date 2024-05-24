'use server';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { formatDateToYYYYMMDD } from './reusableFunctions';
import { ReflectionsType } from '../home/newLogPopup';
import { Win } from '../home/moodPrompts';

export async function updateUser(uid: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	updateDoc(userDocRef, {
		closedConfirmationMessage: true,
	});
}
export async function addUserMood(
	uid: string,
	mood: string,
	selectedDate: string,
	reflections: ReflectionsType[],
	wins: Win[]
) {
	const userDocRef = doc(db, 'authUsers', uid);
	const userDocSnap = await getDoc(userDocRef);

	if (userDocSnap.exists()) {
		const userData = userDocSnap.data();
		if (userData) {
			// Initialize 'moods' array if it doesn't exist initially
			const moodsArray = userData.moods || [];

			const existingMoodIndex = moodsArray.findIndex(
				(moodEntry: any) => moodEntry.date === selectedDate
			);

			if (existingMoodIndex !== -1) {
				// If mood entry for selectedDate exists, update it
				console.log('Existing mood entry found for today. Updating mood...');
				console.log('Existing mood entry:', moodsArray[existingMoodIndex]);
				moodsArray[existingMoodIndex].mood = mood;
				moodsArray[existingMoodIndex].reflections = reflections;
				moodsArray[existingMoodIndex].wins = wins;
			} else {
				// If mood entry for today doesn't exist, append a new entry
				moodsArray.push({
					date: selectedDate,
					mood: mood,
					reflections: reflections,
					wins: wins,
				});
			}

			console.log('Updated moods array:', moodsArray);

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
			return userData;
		})
		.catch((error) => {
			console.error('Error getting user data:', error);
		});
}
