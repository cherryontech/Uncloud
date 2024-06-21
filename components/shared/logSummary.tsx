import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import { CaretLeft, Plus, Minus, Heart } from '@phosphor-icons/react';
import { ReflectionsType } from '../home/newLogPopup';
import { useAuth } from '@/app/context/UserProvider';
import { updateFavorite } from '../utils/serverFunctions';
import { Win } from '../home/moodPrompts';

interface LogSummaryProps {
	log: {
		date: Date;
		mood: string;
		icon: string;
		reflections: ReflectionsType[];
		favorite: boolean;
		wins: Win[];
	};
	handleGoBack: () => void;
	onFavoriteToggle: (
		logDate: string,
		mood: string,
		reflections: ReflectionsType[]
	) => void;
	favoriteLogs: {
		[date: string]: {
			mood: string;
			reflections: ReflectionsType[];
			favorite: boolean;
		};
	};
	fromFavorites: boolean;
	displayedFavoriteLogDates: string[];
}

const LogSummary: React.FC<LogSummaryProps> = ({
	log,
	handleGoBack,
	onFavoriteToggle,
	favoriteLogs,
	fromFavorites,
	displayedFavoriteLogDates,
}) => {
	const moodNames = {
		Rainbow: 'Proud',
		Sunny: 'Confident',
		Cloudy: 'Uncertain',
		Rainy: 'Disappointed',
		Stormy: 'Stressed',
	};

	const { user } = useAuth();

	const [openReflections, setOpenReflections] = useState<number[]>([]);

	const logDate = formatValueTypeToYYYYMMDD(log.date);

	const [favorite, setFavorite] = useState(false);

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [mobile, setMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		setFavorite(favoriteLogs[logDate]?.favorite || false);
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
			setMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [favoriteLogs, logDate]);

	const favoriteLog = async () => {
		const newFavorite = !favorite;
		onFavoriteToggle(logDate, log.mood, log.reflections);
		setFavorite(newFavorite);
		if (user) {
			await updateFavorite(user.uid, logDate, newFavorite);
		}
	};

	const toggleReflection = (index: number) => {
		setOpenReflections((prevState) =>
			prevState.includes(index)
				? prevState.filter((i) => i !== index)
				: [...prevState, index]
		);
	};

	const nonEmptyWins = log.wins.filter((win) => win.description.trim() !== '');
	const nonEmptyReflections = log.reflections.filter(
		(reflection) => reflection.answer.trim() !== ''
	);

	// Check if fromFavorites is true and there are no displayed favorite logs
	if (fromFavorites && displayedFavoriteLogDates.length === 0) {
		return (
			<div className='flex h-full w-full flex-col items-center justify-center'>
				<p className='text-base font-normal text-[#2c2c2c]'>
					No logs have been favorited yet.
				</p>
			</div>
		);
	}

	return (
		<>
			{mobile ? (
				<>
					<div className=' flex max-h-24 flex-col gap-5 pb-4 '>
						<div className='flex  w-full flex-row items-center justify-between gap-4 px-1 text-base font-semibold'>
							{!fromFavorites && (
								<div className='flex flex-row gap-2 text-primary'>
									<button
										onClick={handleGoBack}
										className='flex flex-row items-center justify-center gap-2 '
									>
										<CaretLeft size={8} weight='bold' />
										<span className='flex min-h-12 w-fit items-center justify-center py-1 text-base'>
											Back to Summary
										</span>
									</button>
								</div>
							)}
							{log.mood && log.mood !== 'No Log Yet' && (
								<div className='flex text-[#706F6F]'>
									<button
										onClick={favoriteLog}
										className='flex flex-row items-center justify-center gap-2'
									>
										{favorite ? (
											<Heart size={12} weight='fill' color='red' />
										) : (
											<Heart size={12} weight='bold' />
										)}
									</button>
								</div>
							)}
						</div>
						<div className='h-[0.125rem] bg-[#dee9f5]'></div>
					</div>
					<div className='flex h-full flex-row items-start gap-8 overflow-auto p-2'>
						<div className='flex flex-col items-center justify-center gap-2'>
							<div className='rounded-xl border border-[#DEE9F5] bg-[#FAFCFF]'>
								<Image src={log.icon} alt={log.mood} width={60} height={60} />
							</div>
							<div className='flex flex-col items-center justify-center'>
								<span className='text-xl font-semibold'>{log.mood}</span>
								<span className='text-sm'>
									{moodNames[log.mood as keyof typeof moodNames]}
								</span>
							</div>
						</div>

						<div className='w-full rounded-xl border border-[#DEE9F5] p-4'>
							{nonEmptyWins.length > 0 && (
								<div className='flex flex-col gap-3 '>
									<span className='text-sm font-semibold'>My Wins</span>
									<div className='pl-[1.62rem]'>
										{nonEmptyWins.map((win, index) => (
											<div
												key={index}
												className='relative flex h-fit flex-row items-center justify-start gap-3 '
											>
												<div className='absolute bottom-0 left-0 top-1 flex flex-col items-center gap-1'>
													<div className='h-2 w-2 rounded-full bg-primary'></div>
													{index !== nonEmptyWins.length - 1 && (
														<div className='w-[0.125rem] flex-grow bg-[#DEE9F5]'></div>
													)}
												</div>
												<div className='ml-3 flex flex-col justify-start pb-8 pl-3'>
													<span className='text-sm font-semibold text-[#2C2C2C]'>
														{win.description}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
							{nonEmptyReflections.length > 0 ? (
								<div className='flex flex-col gap-3'>
									<div className='flex flex-row items-center justify-start gap-2 text-sm'>
										<span className='font-semibold'>Reflections</span>
										<span className='text-[#706F6F]'>
											({nonEmptyReflections.length})
										</span>
									</div>

									{nonEmptyReflections.map((reflection, index) => (
										<div
											key={index}
											className={`grid gap-x-5 px-4 py-2 ${openReflections.includes(index) ? 'question-opened grid-cols-[1fr_min-content] grid-rows-2 items-center' : 'question-closed grid-cols-[1fr_min-content] grid-rows-1 rounded-lg border border-[#DEE9F5] bg-[#FAFCFF]'}`}
										>
											<div
												className={`question-div flex flex-row items-center justify-between text-sm text-[#706F6F] ${openReflections.includes(index) ? 'question-opened bg-white' : 'question-closed'}`}
												onClick={() => toggleReflection(index)}
											>
												<span className='font-semibold'>
													{reflection.question}
												</span>
											</div>
											<div
												className={`col-start-2 col-end-3 row-span-2 row-start-1 flex self-stretch justify-self-end ${openReflections.includes(index) ? 'question-opened items-start ' : 'question-closed items-center '}`}
												onClick={() => toggleReflection(index)}
											>
												{openReflections.includes(index) ? (
													<Minus
														size={16}
														weight='light'
														className='h-8 w-8 rounded-full bg-[#DEE9F5] px-1'
													/>
												) : (
													<Plus
														size={16}
														weight='light'
														className='h-8 w-8 rounded-full px-1'
													/>
												)}
											</div>

											{openReflections.includes(index) && (
												<div className='answer-div col-start-1 col-end-2 row-start-2 row-end-3 mt-2 flex flex-col gap-2'>
													<div className='text-xs text-[#706F6F]'>
														{reflection.answer}
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<div className='flex w-full flex-col items-center justify-center'>
									<p className='text-base font-medium text-black'>
										No Reflections yet
									</p>
								</div>
							)}
						</div>
					</div>
				</>
			) : (
				<>
					<div className='flex h-24 flex-col gap-5 pb-4 '>
						<div
							className={`flex min-h-12 w-full flex-row items-center ${fromFavorites ? 'justify-end' : 'justify-between'} gap-4 px-1 text-base font-semibold`}
						>
							{' '}
							{!fromFavorites && ( // Conditionally render Back to Summary button
								<div className='flex flex-row gap-2 text-primary'>
									<button
										onClick={handleGoBack}
										className='flex flex-row items-center justify-center gap-2'
									>
										<CaretLeft size={16} weight='bold' />
										<span className='flex min-h-12 w-fit items-center justify-center py-1 text-base'>
											Back to Summary
										</span>
									</button>
								</div>
							)}
							{log.mood && log.mood !== 'No Log Yet' && (
								<div className='flex text-[#706F6F]'>
									<button
										onClick={favoriteLog}
										className='flex flex-row items-center justify-center gap-2'
									>
										{favorite ? (
											<Heart size={24} weight='fill' color='red' />
										) : (
											<Heart size={24} weight='bold' />
										)}
									</button>
								</div>
							)}
						</div>
						<div className='h-[0.125rem] bg-[#dee9f5]'></div>
					</div>
					<div className='flex h-full flex-col overflow-auto px-3'>
						<div className='flex flex-col items-center justify-center gap-4 py-10'>
							<div className='rounded-xl border border-[#DEE9F5] bg-[#FAFCFF]'>
								<Image src={log.icon} alt={log.mood} width={150} height={150} />
							</div>
							<div className='flex flex-col items-center justify-center'>
								<span className='text-2xl font-semibold'>{log.mood}</span>
								<span className='text-sm'>
									{moodNames[log.mood as keyof typeof moodNames]}
								</span>
							</div>
						</div>

						{nonEmptyWins.length > 0 && (
							<div className='flex flex-col gap-3 '>
								<span className='text-sm font-semibold'>My Wins</span>
								<div className='pl-[1.62rem]'>
									{nonEmptyWins.map((win, index) => (
										<div
											key={index}
											className='relative flex h-fit flex-row items-center justify-start gap-3 '
										>
											<div className='absolute bottom-0 left-0 top-1 flex flex-col items-center gap-1'>
												<div className='h-2 w-2 rounded-full bg-primary'></div>
												{index !== nonEmptyWins.length - 1 && (
													<div className='w-[0.125rem] flex-grow bg-[#DEE9F5]'></div>
												)}
											</div>
											<div className='ml-3 flex flex-col justify-start pb-8 pl-3'>
												<span className='text-sm font-semibold text-[#2C2C2C]'>
													{win.description}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
						{nonEmptyReflections.length > 0 ? (
							<div className='flex flex-col gap-3'>
								<div className='flex flex-row items-center justify-start gap-2 text-sm'>
									<span className='font-semibold'>Reflections</span>
									<span className='text-[#706F6F]'>
										({nonEmptyReflections.length})
									</span>
								</div>

								{nonEmptyReflections.map((reflection, index) => (
									<div
										key={index}
										className={`grid gap-x-5 px-4 py-2 ${openReflections.includes(index) ? 'question-opened grid-cols-[1fr_min-content] grid-rows-2 items-center' : 'question-closed grid-cols-[1fr_min-content] grid-rows-1 rounded-lg border border-[#DEE9F5] bg-[#FAFCFF]'}`}
									>
										<div
											className={`question-div flex flex-row items-center justify-between text-sm text-[#706F6F] ${openReflections.includes(index) ? 'question-opened bg-white' : 'question-closed'}`}
											onClick={() => toggleReflection(index)}
										>
											<span className='font-semibold'>
												{reflection.question}
											</span>
										</div>
										<div
											className={`col-start-2 col-end-3 row-span-2 row-start-1 flex self-stretch justify-self-end ${openReflections.includes(index) ? 'question-opened items-start ' : 'question-closed items-center '}`}
											onClick={() => toggleReflection(index)}
										>
											{openReflections.includes(index) ? (
												<Minus
													size={16}
													weight='light'
													className='h-8 w-8 rounded-full bg-[#DEE9F5] px-1'
												/>
											) : (
												<Plus
													size={16}
													weight='light'
													className='h-8 w-8 rounded-full px-1'
												/>
											)}
										</div>

										{openReflections.includes(index) && (
											<div className='answer-div col-start-1 col-end-2 row-start-2 row-end-3 mt-2 flex flex-col gap-2'>
												<div className='text-xs text-[#706F6F]'>
													{reflection.answer}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className='flex w-full flex-col items-center justify-center'>
								<p className='text-base font-medium text-black'>
									No Reflections yet
								</p>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default LogSummary;
