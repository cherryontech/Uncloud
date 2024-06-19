import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import Image from 'next/legacy/image';
import { Check, CalendarBlank } from '@phosphor-icons/react';
import { Button } from '@/stories/Button';
import ProgressBar from '@/stories/progressBar';
import MoodPrompts, { Win } from './moodPrompts';
import { FaArrowLeft } from 'react-icons/fa6';
import { GoArrowDownLeft, GoArrowLeft } from 'react-icons/go';
import { LuArrowLeft } from 'react-icons/lu';
import { useRouter } from 'next/navigation';

export type ReflectionsType = {
	question: string;
	answer: string;
};

type Props = {
	isPopupOpen: boolean;

	selectedDate: string;
	displayDate: string;
	saveMood: (
		date: string,
		mood: string,
		reflections: ReflectionsType[],
		favorite: boolean,
		wins: Win[]
	) => Promise<void>;
	setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleLogClick: (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
		favorite: boolean;
		wins?: Win[];
	}) => void;
	mobile?: boolean;
};

type Mood = {
	[key: string]: string;
};

const NewLogPopup = ({
	isPopupOpen,

	selectedDate,
	displayDate,
	saveMood,
	setPopupOpen,
	handleLogClick,
	mobile,
}: Props) => {
	const [selectedMood, setSelectedMood] = useState<string>(''); // State to hold the selected mood
	const [currentStep, setCurrentStep] = useState<number>(1); // State to hold the current step
	const [initialReflections, setInitialReflections] = useState<
		ReflectionsType[]
	>([]);
	const [initialWins, setInitialWins] = useState<Win[]>([]);
	const [showFinalProgress, setShowFinalProgress] = useState<boolean>(false); // State for final progress bar
	const { user, isUpdated } = useAuth();
	
	useEffect(() => {
		if (user && selectedDate) {
			getUser(user.uid).then((userData) => {
				if (!userData || !userData.moods || userData.moods.length === 0) {
					return;
				}

				const selectedMoodEntry = userData.moods.find(
					(entry: any) => entry.date === selectedDate
				);

				if (selectedMoodEntry) {
					setSelectedMood(selectedMoodEntry.mood);
					selectedMoodEntry.reflections
						? setInitialReflections(selectedMoodEntry.reflections)
						: setInitialReflections([]);

					selectedMoodEntry.wins
						? setInitialWins(selectedMoodEntry.wins)
						: setInitialWins([]);
				} else {
					setInitialReflections([]);
					setInitialWins([]);

					setSelectedMood('');
				}
			});
		}
	}, [user, selectedDate, isUpdated]);

	if (!isPopupOpen) return null;

	const handleClickInside = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.stopPropagation();
	};

	const moods: Mood[] = [
		{ Rainbow: 'Proud' },
		{ Sunny: 'Confident' },
		{ Cloudy: 'Uncertain' },
		{ Rainy: 'Disappointed' },
		{ Stormy: 'Stressed' },
	];
	const handleChangeStep = (step: number) => {
		if (!user) return;
		setCurrentStep(step);
	};
	const handleLogPopupToggle = () => {
		setPopupOpen(false);
		setCurrentStep(1);
	};
	const handleSaveMood = async (
		reflections: ReflectionsType[],
		wins: Win[]
	) => {
		if (!user) return;
		if (!selectedMood) {
			setPopupOpen(false);

			return;
		}
		// Show the final progress bar briefly
		setShowFinalProgress(true);
		await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 500 milliseconds

		await saveMood(selectedDate, selectedMood, reflections, false, wins);
		console.log('Saved reflections:', reflections);
		console.log('Favorite:', false);
		setPopupOpen(false);
		setCurrentStep(1);
		setShowFinalProgress(false);
		
		console.log('handleSaveMood: Closing popup');
	};

	return (
		<div
			onClick={handleLogPopupToggle}
			className='absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black/20'
		>
			<div
				className='relative flex h-full w-full flex-col items-center justify-center gap-4 border border-black bg-[#FAFCFF] p-8 text-center'
				onClick={handleClickInside}
			>
				{showFinalProgress && <ProgressBar progress={100} />}
				<ProgressBar progress={currentStep * 33} />
				{currentStep > 1 && (
					<button
						className='absolute left-2 top-2 text-sm text-gray-500 hover:text-gray-700'
						onClick={() => handleChangeStep(1)}
					>
						{mobile ? (
							<LuArrowLeft size={20} color='#2D81E0' />
						) : (
							<LuArrowLeft size={28} color='#2D81E0' />
						)}
					</button>
				)}
				<button
					className='absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-700'
					onClick={handleLogPopupToggle}
				>
					{mobile ? (
						<IoClose size={24} color='#2D81E0' />
					) : (
						<IoClose size={32} color='#2D81E0' />
					)}
				</button>
				{currentStep === 1 && (
					<div className='flex flex-col justify-center gap-28'>
						<div className='flex flex-col items-center justify-center gap-4'>
							<span className='text-xl font-semibold uppercase text-primary'>
								Create New
							</span>
							<span className='text-3xl font-semibold'>
								How&apos;s the weather?
							</span>
							<div className='justify-content align-items flex flex-row gap-2 text-[#706F6F]'>
								<div className='flex items-center justify-center '>
									{mobile ? (
										<CalendarBlank size={12} />
									) : (
										<CalendarBlank size={24} />
									)}
								</div>
								<span className='align-items justify-content flex items-center text-2xl'>
									{' '}
									{displayDate}
								</span>
							</div>
						</div>
						<div className='flex flex-col items-center justify-center gap-24'>
							<div
								className={`flex  flex-row items-center ${mobile ? 'gap-4' : 'gap-8'}`}
							>
								{moods.map((mood, index) => {
									const moodName = Object.keys(mood)[0];
									const moodDescription = mood[moodName];

									return (
										<div
											key={index}
											className={`flex h-[15.1rem] w-[12rem] flex-col items-center justify-center rounded-lg border px-4 py-4 ${
												selectedMood === moodName
													? 'border-2 border-primary bg-white shadow-[0_15px_20px_0_rgba(0,0,0,0.3)]'
													: 'bg-white opacity-85'
											}`}
											onClick={() => setSelectedMood(moodName)}
										>
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
												<span className='text-xl font-semibold'>
													{moodName}
												</span>
												<span className='text-sm font-normal leading-normal'>
													{moodDescription}
												</span>
											</div>
										</div>
									);
								})}
							</div>
							<div className='flex w-[22.5rem] flex-col justify-center gap-3 text-sm'>
								<Button
									type='button'
									label='Continue to Reflection'
									primary
									onClick={() => handleChangeStep(2)}
									version='primary'
								/>
								<button
									onClick={() => {
										handleSaveMood(initialReflections, initialWins);
									}}
									className='px-6 py-[0.625rem] text-sm font-bold text-[#2D81E0]'
								>
									Done Logging
								</button>
							</div>
						</div>
					</div>
				)}
				{currentStep === 2 && (
					<MoodPrompts
						selectedMood={selectedMood}
						handleChangeStep={handleChangeStep}
						handleSaveMood={handleSaveMood}
						initialReflections={initialReflections}
						initialWins={initialWins}
						mobile={mobile}
					/>
				)}
			</div>
		</div>
	);
};

export default NewLogPopup;
