'use client';
import { useAuth } from '@/app/context/UserProvider';
import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/serverFunctions';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import { MoodEntry } from '../home/calendar';
import Image from 'next/image';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

type Props = {};
type MoodNames = {
	[key: string]: string;
};
const Rightbar = (props: Props) => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<{ [key: string]: string }>({});
	const [filter, setFilter] = useState(''); // State for mood filter
	console.log(isUpdated);
	useEffect(() => {
		console.log('isUpdated changed:', isUpdated); // Add this logging

		if (user) {
			getUser(user.uid).then((userData) => {
				if (userData && userData.moods) {
					let moodMap: { [key: string]: string } = {};

					userData.moods.forEach((moodEntry: MoodEntry) => {
						const dateParts = moodEntry.date
							.split('-')
							.map((part) => parseInt(part, 10));
						const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
						moodMap[formatValueTypeToYYYYMMDD(date)] = moodEntry.mood;
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

	const currentDate = new Date();
	const currentMonth = currentDate.getUTCMonth();
	const currentYear = currentDate.getUTCFullYear();


	const currentMonthMoods = Object.entries(moods).filter(([date, mood]) => {
		const dateObj = new Date(`${date}T00:00:00Z`);
		return (
			dateObj.getUTCMonth() === currentMonth &&
			dateObj.getUTCFullYear() === currentYear
		);
	});

	// If a filter is selected, filter the moods; otherwise, get the last 7 moods
	const filteredMoods = filter
		? currentMonthMoods
				.sort(
					([date1], [date2]) =>
						new Date(date2).getDate() - new Date(date1).getDate()
				)
				.filter(([date, mood]) => mood === filter)
		: currentMonthMoods
				.sort(
					([date1], [date2]) =>
						new Date(date2).getDate() - new Date(date1).getDate()
				)
				.slice(0, 7);
	return (
		<div className='flex h-full w-full flex-col gap-4 bg-[#F3F5F9] pb-6 '>
			<div className='flex h-full flex-col justify-start gap-2 rounded-2xl bg-white p-6 space-y-4 '>
				<div className='flex h-fit flex-row items-center justify-between text-base font-semibold'>
					<p>Summary Page</p>
					<div className=''>
						<select
							id='moodFilter'
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className='rounded border p-2'
						>
							<option value=''>All</option>
							{Array.from(new Set(Object.values(moods))).map((mood) => (
								<option key={mood} value={mood}>
									{mood.charAt(0).toUpperCase() + mood.slice(1)}
								</option>
							))}
						</select>
					</div>
				</div>
				{filteredMoods.map(([date, mood], index) => {
					const dateObj = new Date(`${date}T00:00:00Z`);
					const day = dateObj.getUTCDate();
					const month = dateObj.toLocaleString('default', { month: 'short' });
					// console.log(mood);
					return (
						<div
							key={date}
							className='bg-boxBackground hover:bg-hoverColor group flex h-fit w-full cursor-pointer items-center justify-between gap-2 rounded-lg border  border-blue-100 p-2 text-textPrimary '
						>
							<div>
								<p className='text-xl font-medium text-gray-600'>{day}</p>
								<p className='text-sm text-gray-600'>{month}</p>
							</div>
							<div className='border border-blue-100 hover:border-white h-20 border-r'></div>
							<div className='w-1/3'>
								<Image
									src={`/moods/${mood.toLowerCase()}.svg`}
									alt='Mood'
									width={200}
									height={200}
									className='w-full'
								/>
							</div>
							<div>
								<p className='text-xl font-medium text-black'>
									{mood.charAt(0).toUpperCase() + mood.slice(1)}
								</p>
								<p className='text-sm text-gray-500'>{moodNames[mood]}</p>
							</div>
							<MdOutlineKeyboardArrowRight
								className='text-black group-hover:text-blue-500'
								size={30}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Rightbar;
