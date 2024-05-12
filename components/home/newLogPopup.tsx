import React, { useState, useEffect } from 'react';
import { FaCross } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { addUserMood, getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import Image from 'next/image';
import { Check, CalendarBlank } from '@phosphor-icons/react';
import { Button } from '@/stories/Button';
import ProgressBar from '@/stories/progressBar';

type Props = {
	showPopup: boolean;
	handlePopupToggle: () => void;
	selectedDate: string;
	displayDate: string;
};

type Mood = {
	[key: string]: string;
};

const NewLogPopup = ({
	showPopup,
	handlePopupToggle,
	selectedDate,
	displayDate,
}: Props) => {
	const [selectedMood, setSelectedMood] = useState<string>(''); // State to hold the selected mood
	const { user } = useAuth();

	useEffect(() => {
		if (user && selectedDate) {
			getUser(user.uid).then((userData) => {
				if (!userData || !userData.moods || userData.moods.length === 0) {
					console.log('No mood data found for the user');
					return;
				}
				console.log('All mood entries:', userData.moods);

				const selectedMoodEntry = userData.moods.find(
					(entry: any) => entry.date === selectedDate
				);

				if (selectedMoodEntry) {
					setSelectedMood(selectedMoodEntry.mood);
				} else {
					setSelectedMood('');
				}
			});
		}
	}, [user, selectedDate]);

	if (!showPopup) return null;

	console.log('Selected Date Prop:', selectedDate);
	console.log('Selected Mood:', selectedMood);

	const handleClickInside = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.stopPropagation();
	};
	// const moods = ['rainbow', 'sunny', 'cloudy', 'rainy', 'stormy'];
	const moods: Mood[] = [
		{ Rainbow: 'Proud' },
		{ Sunny: 'Confident' },
		{ Cloudy: 'Uncertain' },
		{ Rainy: 'Disappointed' },
		{ Stormy: 'Stressed' },
	];

	const handleSaveMood = async () => {
		if (!user) return;
		await addUserMood(user.uid, selectedMood, selectedDate);
		handlePopupToggle();
	};
	console.log(selectedDate);
	return (
		<div
			onClick={handlePopupToggle}
			className='absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black/20'
		>
			<div
				className='relative flex h-full w-full flex-col items-center justify-center gap-4 border border-black bg-[#FAFCFF] p-8 text-center'
				onClick={handleClickInside}
			>
				<ProgressBar progress={33} />
				<button
					className='absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700'
					onClick={handlePopupToggle}
				>
					<IoClose size={32} color='#2D81E0' />
				</button>
				<div className='flex flex-col justify-center gap-28'>
					<div className='flex flex-col items-center justify-center gap-4'>
						<span className='text-xl font-semibold uppercase text-[#2D81E0]'>
							Create New
						</span>
						<span className='text-3xl font-semibold'>
							How&apos;s the weather?
						</span>
						<div className='justify-content align-items flex flex-row gap-2 text-[#706F6F]'>
							<div className='flex items-center justify-center '>
								<CalendarBlank size={24} />
							</div>

							<span className='align-items justify-content flex items-center text-2xl'>
								{' '}
								{displayDate}
							</span>
						</div>
					</div>
					<div className='flex flex-col items-center justify-center gap-24'>
						<div className='flex  flex-row items-center gap-2'>
							{moods.map((mood, index) => {
								const moodName = Object.keys(mood)[0];
								const moodDescription = mood[moodName];

								return (
									<div
										key={index}
										className={`flex h-[15.1rem] w-[12rem] flex-col items-center justify-center rounded-lg border px-4 py-4 ${
											selectedMood === moodName
												? 'border-2 border-[#2D81E0] shadow-[0_15px_20px_0_rgba(0,0,0,0.3)]'
												: 'bg-white'
										}`}
										onClick={() => setSelectedMood(moodName)}
									>
										{/* in public/moods/ I have logos to correspond to each mood (moodName in lower case (e.g., cloudy.svg); add the mood's logo here) */}
										<div className='align-center relative flex flex-col items-center justify-center'>
											<label className='checkbox-container'>
												<input
													type='checkbox'
													className='hidden-checkbox'
													checked={selectedMood === moodName}
													onChange={() => setSelectedMood(moodName)}
												/>
												<span className='custom-checkbox'>
													{selectedMood === moodName && (
														<Check size={24} weight='bold' />
													)}
												</span>
											</label>
											<div className='relative h-[7.8rem] w-[7.8rem]'>
												<Image
													src={`/moods/${moodName.toLowerCase()}.svg`}
													alt={moodName}
													layout='fill'
												/>
											</div>
											<span className='text-xl font-semibold'>{moodName}</span>
											<span className='text-sm font-normal leading-normal'>
												{moodDescription}
											</span>
										</div>
									</div>
								);
							})}
						</div>
						{/* <button
							onClick={handleSaveMood}
							className='w-1/2 rounded-full bg-slate-400 p-2'
						>
							Save Mood
						</button> */}
						<div className='flex w-[22.5rem] justify-center'>
							<Button
								type='button'
								label='Continue'
								primary
								onClick={handleSaveMood}
								version='primary'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewLogPopup;
