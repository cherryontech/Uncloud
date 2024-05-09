import React, { useState, useEffect } from 'react';
import { FaCross } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { addUserMood, getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';

type Props = {
	showPopup: boolean;
	handlePopupToggle: () => void;
	selectedDate: string;
};

const NewLogPopup = ({ showPopup, handlePopupToggle, selectedDate }: Props) => {
	const [selectedMood, setSelectedMood] = useState<string>(''); // State to hold the selected mood
	const { user } = useAuth();

	useEffect(() => {
		if (user && selectedDate) {
			getUser(user.uid).then((userData) => {
				if (!userData || !userData.moods || userData.moods.length === 0) return;

				const selectedMoodEntry = userData.moods.find(
					(entry: any) => entry.date === selectedDate
				);
				console.log(userData.moods);
				if (selectedMoodEntry) {
					setSelectedMood(selectedMoodEntry.mood);
				} else {
					setSelectedMood(''); // Reset selected mood if no entry found for the selected date
				}
			});
		}
	}, [user, selectedDate]);

	if (!showPopup) return null;

	const handleClickInside = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.stopPropagation();
	};
	const moods = ['okay', 'happy', 'sad', 'worried'];
	const handleSaveMood = async () => {
		if (!user) return;
		await addUserMood(user.uid, selectedMood);
		handlePopupToggle();
	};
	console.log(selectedDate);
	return (
		<div
			onClick={handlePopupToggle}
			className='absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black/20'
		>
			<div
				className='relative flex max-w-[25rem] flex-col items-center justify-center gap-4 border border-black bg-white p-8 text-center'
				onClick={handleClickInside}
			>
				<button
					className='absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700'
					onClick={handlePopupToggle}
				>
					<IoClose size={40} />
				</button>
				<h1 className='text-3xl'>
					What’s the weather looking like for you today?
				</h1>
				<div className='h-40 w-40 rounded-full bg-gray-300'></div>
				<h1 className='text-3xl'>
					Sunshine <br /> ({selectedMood || 'Select a mood'})
				</h1>
				<div className='flex flex-row items-center gap-2'>
					{moods.map((mood) => (
						<div
							key={mood}
							className={`rounded-lg px-4 py-5 ${
								selectedMood === mood ? 'bg-blue-400' : 'bg-gray-300'
							}`}
							onClick={() => setSelectedMood(mood)}
						>
							{mood}
						</div>
					))}
				</div>
				<button
					onClick={handleSaveMood}
					className='w-1/2 rounded-full bg-slate-400 p-2'
				>
					Save Mood
				</button>
			</div>
		</div>
	);
};

export default NewLogPopup;
