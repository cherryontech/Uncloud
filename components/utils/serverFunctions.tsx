'use server';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { formatDateToYYYYMMDD } from './reusableFunctions';
import { ReflectionsType } from '../home/newLogPopup';

export async function updateFavorite(
	uid: string,
	date: string,
	favorite: boolean
) {
	const userDocRef = doc(db, 'authUsers', uid);
	const userDocSnap = await getDoc(userDocRef);

	if (userDocSnap.exists()) {
		const userData = userDocSnap.data();
		if (userData) {
			// Initialize 'moods' array if it doesn't exist initially
			const moodsArray = userData.moods || [];

			const existingMoodIndex = moodsArray.findIndex(
				(moodEntry: any) => moodEntry.date === date
			);

			if (existingMoodIndex !== -1) {
				// If mood entry for selectedDate exists, update it
				console.log('Existing mood entry found for today. Updating mood...');
				console.log('Existing mood entry:', moodsArray[existingMoodIndex]);
				moodsArray[existingMoodIndex].favorite = favorite;
			}

			console.log('Updated moods array:', moodsArray);

			// Update the document with the modified moods array
			await updateDoc(userDocRef, { moods: moodsArray });
		}
	}
}

// export async function getFavoriteLogs(uid: string) {
// 	const userDocRef = doc(db, 'authUsers', uid);
// 	const userDocSnap = await getDoc(userDocRef);

// 	if (userDocSnap.exists()) {
// 		const userData = userDocSnap.data();
// 		if (userData && userData.moods) {
// 			return userData.moods.reduce(
// 				(favoriteLogs: { [date: string]: boolean }, moodEntry: any) => {
// 					if (moodEntry.favorite) {
// 						favoriteLogs[moodEntry.date] = true;
// 					}
// 					return favoriteLogs;
// 				},
// 				{}
// 			);
// 		}
// 	}

// 	return {};
// }

export async function getFavoriteLogs(uid: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	const userDocSnap = await getDoc(userDocRef);

	if (userDocSnap.exists()) {
		const userData = userDocSnap.data();
		if (userData && userData.moods) {
			return userData.moods.reduce(
				(
					favoriteLogs: {
						[date: string]: {
							mood: string;
							reflections: ReflectionsType[];
							favorite: boolean;
						};
					},
					moodEntry: any
				) => {
					if (moodEntry.favorite) {
						favoriteLogs[moodEntry.date] = {
							mood: moodEntry.mood,
							reflections: moodEntry.reflections,
							favorite: moodEntry.favorite,
						};
					}
					return favoriteLogs;
				},
				{}
			);
		}
	}

	return {};
}

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
	favorite: boolean
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
				moodsArray[existingMoodIndex].favorite = favorite;
			} else {
				// If mood entry for today doesn't exist, append a new entry
				moodsArray.push({
					date: selectedDate,
					mood: mood,
					reflections: reflections,
					favorite: favorite,
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
