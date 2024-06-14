// serverFunctions.ts

'use server';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { formatDateToYYYYMMDD } from './reusableFunctions';
import { ReflectionsType } from '../home/newLogPopup';
import { Win } from '../home/moodPrompts';

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
			const moodsArray = userData.moods || [];
			const existingMoodIndex = moodsArray.findIndex(
				(moodEntry: any) => moodEntry.date === date
			);

			if (existingMoodIndex !== -1) {
				moodsArray[existingMoodIndex].favorite = favorite;
			}

			console.log('Updated moods array:', moodsArray);

			await updateDoc(userDocRef, { moods: moodsArray });
		}
	}
}

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

export async function updateUser(uid: string, data: object) {
	const userDocRef = doc(db, 'authUsers', uid);
	await updateDoc(userDocRef, data);
}

export async function addUserMood(
	uid: string,
	mood: string,
	selectedDate: string,
	reflections: ReflectionsType[],
	favorite: boolean,
	wins: Win[]
) {
	const userDocRef = doc(db, 'authUsers', uid);
	const userDocSnap = await getDoc(userDocRef);

	if (userDocSnap.exists()) {
		const userData = userDocSnap.data();
		if (userData) {
			const moodsArray = userData.moods || [];
			const existingMoodIndex = moodsArray.findIndex(
				(moodEntry: any) => moodEntry.date === selectedDate
			);

			if (existingMoodIndex !== -1) {
				moodsArray[existingMoodIndex].mood = mood;
				moodsArray[existingMoodIndex].reflections = reflections;
				moodsArray[existingMoodIndex].favorite = favorite;
				moodsArray[existingMoodIndex].wins = wins;
			} else {
				moodsArray.push({
					date: selectedDate,
					mood: mood,
					reflections: reflections,
					favorite: favorite,
					wins: wins,
				});
			}

			await updateDoc(userDocRef, { moods: moodsArray });
		}
	}
}

export async function getUser(uid: string) {
	const userDocRef = doc(db, 'authUsers', uid);
	return getDoc(userDocRef)
		.then((userDocSnapshot) => {
			const userData = userDocSnapshot.data();
			return userData;
		})
		.catch((error) => {
			console.error('Error getting user data:', error);
		});
}
