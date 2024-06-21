import { useAuth } from '@/app/context/UserProvider';
import { getUser } from '../utils/serverFunctions';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CaretRight } from '@phosphor-icons/react';
import FilterDropdown from './filterDropdown';
import CustomPagination from './customPagination';
import { MoodEntry, Value } from '../home/calendar';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import { ReflectionsType } from '../home/newLogPopup';
import { Win } from '../home/moodPrompts';

export type MoodNames = {
	[key: string]: string;
};

type LogSummaryListProps = {
	handleLogClick: (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
		favorite: boolean;
		wins?: Win[];
	}) => void;
	selectedDate: Value;
	value: Value | null;
	setValue: React.Dispatch<React.SetStateAction<Value | null>>;
	handleDateChange: (newValue: Value) => void;
	currentPage: number;
	handlePagination: (value: { selected: number }) => void;
	mobile: boolean;
};

const LogSummaryList: React.FC<LogSummaryListProps> = ({
	handleLogClick,
	handleDateChange,
	currentPage,
	handlePagination,
	selectedDate,
	mobile,
}) => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<{
		[key: string]: {
			mood: string;
			reflections: ReflectionsType[];
			favorite: boolean;
			wins: Win[];
		};
	}>({});
	const [selectedFilters, setSelectedFilters] = useState({
		Rainbow: false,
		Sunny: false,
		Cloudy: false,
		Rainy: false,
		Stormy: false,
	});

	const handleCheckboxChange = (filter: string) => {
		setSelectedFilters((prevState) => ({
			...prevState,
			[filter]: !prevState[filter as keyof typeof selectedFilters],
		}));
	};

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData) => {
				if (userData && userData.moods) {
					let moodMap: {
						[key: string]: {
							mood: string;
							reflections: ReflectionsType[];
							favorite: boolean;
							wins: Win[];
						};
					} = {};

					userData.moods.forEach((moodEntry: MoodEntry) => {
						const dateParts = moodEntry.date
							.split('-')
							.map((part) => parseInt(part, 10));
						const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
						moodMap[formatValueTypeToYYYYMMDD(date)] = {
							mood: moodEntry.mood,
							reflections: moodEntry.reflections,
							favorite: moodEntry.favorite,
							wins: moodEntry.wins,
						}; // Update this line
					});
					setMoods(moodMap);
				}
			});
		}
	}, [user, isUpdated]);

	const moodNames: MoodNames = {
		Rainbow: 'Proud',
		Sunny: 'Confident',
		Cloudy: 'Uncertain',
		Rainy: 'Disappointed',
		Stormy: 'Stressed',
	};

	let currentMonth: number | null = null;
	let currentYear: number | null = null;
	if (selectedDate instanceof Date) {
		currentMonth = selectedDate.getUTCMonth();
		currentYear = selectedDate.getUTCFullYear();
	} else if (Array.isArray(selectedDate)) {
		// You can handle the array case here if needed
		const [startDate, endDate] = selectedDate;
		if (startDate instanceof Date) {
			currentMonth = startDate.getUTCMonth();
			currentYear = startDate.getUTCFullYear();
		} else if (endDate instanceof Date) {
			currentMonth = endDate.getUTCMonth();
			currentYear = endDate.getUTCFullYear();
		}
	}

	const currentMonthMoods = Object.entries(moods).filter(([date, mood]) => {
		const dateObj = new Date(`${date}T00:00:00Z`);
		return (
			dateObj.getUTCMonth() === currentMonth &&
			dateObj.getUTCFullYear() === currentYear
		);
	});

	const filteredMoods = currentMonthMoods
		.filter(([date, { mood: moodValue, reflections }]) => {
			if (Object.values(selectedFilters).some((filter) => filter)) {
				return Object.keys(selectedFilters).some(
					(filter) =>
						selectedFilters[filter as keyof typeof selectedFilters] &&
						filter === moodValue
				);
			}
			return true;
		})
		.sort(([date1], [date2]) => {
			return (
				new Date(`${date2}T00:00:00Z`).getTime() -
				new Date(`${date1}T00:00:00Z`).getTime()
			);
		});
	const pageSize = 7;
	const indexOfLastMood = currentPage * pageSize;
	const indexOfFirstMood = indexOfLastMood - pageSize;
	const currentMoods = filteredMoods.slice(indexOfFirstMood, indexOfLastMood);

	return (
		<>
			{mobile ? (
				<>
					<div className='flex max-h-24 flex-col gap-2 pb-4'>
						<div className='flex w-full flex-row items-center justify-between  text-base font-semibold'>
							<span className='flex min-h-12 w-fit items-center justify-center text-xl'>
								Summary Page
							</span>
							<FilterDropdown
								handleCheckboxChange={handleCheckboxChange}
								selectedFilters={selectedFilters}
								mobile={mobile}
							/>
						</div>
						{/* Divider */}
						<div className='h-[0.125rem] bg-[#dee9f5]'></div>
					</div>
					<div className='flex h-full flex-col gap-3 overflow-auto pr-4'>
						{currentMoods.length > 0 ? (
							currentMoods.map(([date, mood], index) => {
								const dateObj = new Date(`${date}T00:00:00`);
								const day = dateObj.getUTCDate();
								const month = dateObj.toLocaleString('default', {
									month: 'short',
									timeZone: 'UTC',
								});
								return (
									<div
										key={date}
										className='group flex h-20 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-blue-100 bg-boxBackground px-4 py-2  text-textPrimary hover:bg-hoverColor 2xl:gap-[2.9375rem]'
										onClick={() => {
											handleLogClick({
												date: dateObj,
												mood: mood.mood,
												icon: `/moods/${mood.mood.toLowerCase()}.svg`,
												reflections: mood.reflections,
												favorite: mood.favorite,
												wins: mood.wins,
											});
											handleDateChange(dateObj);
										}}
									>
										<div className='flex h-full w-full flex-row items-center justify-start gap-4'>
											<div className='justify-content flex flex-col items-center gap-[0.3125rem] leading-none text-[#706F6F]'>
												<span className='m-0 p-0 text-2xl font-medium'>
													{day}
												</span>
												<span className='m-0 p-0 text-xs'>{month}</span>
											</div>

											<div className='h-full w-[0.0625rem] bg-[#dee9f5] group-hover:bg-white'></div>
											<div className='flex h-16 w-16 items-center justify-center rounded-lg bg-white'>
												<Image
													src={`/moods/${mood.mood.toLowerCase()}.svg`}
													alt='Mood'
													width={200}
													height={200}
													// className='w-full'
												/>
											</div>
											<div className='items-left flex w-20 flex-col justify-center gap-[0.4rem]'>
												<span className='text-base font-medium text-black'>
													{mood.mood.charAt(0).toUpperCase() +
														mood.mood.slice(1)}
												</span>
												<span className='text-xs text-gray-500'>
													{moodNames[mood.mood]}
												</span>
											</div>
										</div>
										<div className='flex h-full w-fit flex-row items-center justify-start gap-4 leading-none'>
											<CaretRight
												className='text-black group-hover:text-blue-500'
												size={8}
												color='#2c2c2c'
												weight='bold'
											/>
										</div>
									</div>
								);
							})
						) : (
							<div className='flex h-full w-full flex-col items-center justify-center'>
								<p className='text-sm font-medium text-black'>
									No summaries yet
								</p>
								<div className='h-auto w-[11.125rem]'>
									<Image
										src='/moods/default.svg'
										alt='Empty'
										width={200}
										height={200}
										className='w-full'
									/>
								</div>
								<p className='text-sm font-normal text-gray-500'>
									Add a log to get started!
								</p>
							</div>
						)}
					</div>
				</>
			) : (
				<>
					<div className='flex max-h-24 flex-col gap-5 pb-4'>
						<div className='flex w-full flex-row items-center justify-between  text-base font-semibold'>
							<span className='flex min-h-12 w-fit items-center justify-center py-1 text-base'>
								Summary Page
							</span>
							<FilterDropdown
								handleCheckboxChange={handleCheckboxChange}
								selectedFilters={selectedFilters}
								mobile={mobile}
							/>
						</div>
						{/* Divider */}
						<div className='h-[0.125rem] bg-[#dee9f5]'></div>
					</div>
					<div className='flex h-full flex-col gap-3 overflow-auto pr-2'>
						{currentMoods.length > 0 ? (
							currentMoods.map(([date, mood], index) => {
								const dateObj = new Date(`${date}T00:00:00`);
								const day = dateObj.getUTCDate();
								const month = dateObj.toLocaleString('default', {
									month: 'short',
									timeZone: 'UTC',
								});
								return (
									<div
										key={date}
										className='group flex h-20 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-blue-100 bg-boxBackground px-4 py-2  text-textPrimary hover:bg-hoverColor 2xl:gap-[2.9375rem]'
										onClick={() => {
											handleLogClick({
												date: dateObj,
												mood: mood.mood,
												icon: `/moods/${mood.mood.toLowerCase()}.svg`,
												reflections: mood.reflections,
												favorite: mood.favorite,
												wins: mood.wins,
											});
											handleDateChange(dateObj);
										}}
									>
										<div className='flex h-full w-full flex-row items-center'>
											<div className='flex h-full w-full flex-row items-center justify-start'>
												<div className='justify-content flex flex-col items-center gap-[0.3125rem] leading-none text-[#706F6F]'>
													<span className='m-0 p-0 text-xl font-medium'>
														{day}
													</span>
													<span className='m-0 p-0 text-xs'>{month}</span>
												</div>
											</div>
											<div className='flex h-full w-full flex-row items-center justify-start px-[.8rem]'>
												<div className='h-full w-[0.0625rem] bg-[#dee9f5] group-hover:bg-white'></div>
											</div>
											<div className='flex h-full w-full flex-row items-center justify-start'>
												<div className='flex h-16 w-16 items-center justify-center rounded-lg bg-white'>
													<Image
														src={`/moods/${mood.mood.toLowerCase()}.svg`}
														alt='Mood'
														width={200}
														height={200}
													/>
												</div>
											</div>
											<div className='flex h-full w-full flex-row items-center justify-start pl-[10%] leading-none'>
												<div className='items-left flex w-20 flex-col justify-center gap-[0.66rem]'>
													<span className='text-base font-medium text-black'>
														{mood.mood.charAt(0).toUpperCase() +
															mood.mood.slice(1)}
													</span>
													<span className='text-[0.7rem] text-gray-500'>
														{moodNames[mood.mood]}
													</span>
												</div>
											</div>
										</div>
										<div className='flex h-full w-full flex-row items-center justify-end'>
											<CaretRight
												className='text-black group-hover:text-blue-500'
												size={16}
												weight='bold'
											/>
										</div>
									</div>
								);
							})
						) : (
							<div className='flex h-full w-full flex-col items-center justify-center'>
								<p className='text-sm font-medium text-black'>
									No summaries yet
								</p>
								<div className='h-auto w-[11.125rem]'>
									<Image
										src='/moods/greyWithFace.svg'
										alt='Empty'
										width={200}
										height={200}
										className='w-full'
									/>
								</div>
								<p className='text-sm font-normal text-gray-500'>
									Add a log to get started!
								</p>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default LogSummaryList;
