'use client';
import { useAuth } from '@/app/context/UserProvider';
import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/serverFunctions';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import { MoodEntry } from '../home/calendar';
import Image from 'next/image';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import FilterDropdown from './filterDropdown';
import CustomPagination from './customPagination';
import { CaretRight } from '@phosphor-icons/react';

type Props = {};
export type MoodNames = {
	[key: string]: string;
};
const Rightbar = (props: Props) => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<{ [key: string]: string }>({});
	const [selectedFilters, setSelectedFilters] = useState({
		Rainbow: false,
		Sunny: false,
		Cloudy: false,
		Rainy: false,
		Stormy: false,
	});
	const [currentPage, setCurrentPage] = useState(1);
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

	const filteredMoods = currentMonthMoods
		.filter(([date, mood]) => {
			if (Object.values(selectedFilters).some((filter) => filter)) {
				return Object.keys(selectedFilters).some(
					(filter) =>
						selectedFilters[filter as keyof typeof selectedFilters] &&
						filter === mood
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

	const handlePagination = (value: { selected: number }) => {
		setCurrentPage(value.selected + 1);
	};

	return (
		<div className='flex h-full w-full flex-col gap-4 bg-[#F3F5F9] pb-6 '>
			<div className='flex h-full flex-col justify-start gap-2 space-y-4 rounded-2xl bg-white px-2 py-6 '>
				<div className='flex h-fit flex-row items-center justify-between px-4 text-base font-semibold'>
					<p>Summary Page</p>
					<FilterDropdown
						handleCheckboxChange={handleCheckboxChange}
						selectedFilters={selectedFilters}
					/>
				</div>
				<hr className='border-t-3 my-2 w-full border-blue-100' />
				{currentMoods.length > 0 ? (
					currentMoods.map(([date, mood], index) => {
						const dateObj = new Date(`${date}T00:00:00Z`);
						const day = dateObj.getUTCDate();
						const month = dateObj.toLocaleString('default', {
							month: 'short',
							timeZone: 'UTC',
						});
						// console.log(mood);
						return (
							<div
								key={date}
								className='group flex h-[4.5rem] w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-blue-100 bg-boxBackground  px-4 text-textPrimary hover:bg-hoverColor '
							>
								<div className='justify-content flex flex-col items-center'>
									<p className='text-xl font-medium text-gray-600'>{day}</p>
									<p className='text-sm text-gray-600'>{month}</p>
								</div>

								<div className='h-10 border border-r border-blue-100 group-hover:border-white'></div>
								<div className='w-1/4'>
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
								<CaretRight
									className='text-black group-hover:text-blue-500'
									size={16}
									weight='bold'
								/>
							</div>
						);
					})
				) : (
					<div className='flex h-full w-full flex-col items-center justify-center'>
						<p className='text-base font-medium text-black'>No summaries yet</p>
						<Image
							src='/moods/greyWithFace.svg'
							alt='Empty'
							width={200}
							height={200}
							className='w-full'
						/>
						<p className='text-base font-medium text-gray-500'>
							Add a log to get started!
						</p>
					</div>
				)}
				<hr className='border-t-3 my-2 w-full border-blue-100' />
				<div className='!mb-10 !mt-auto flex items-center justify-between '>
					<div>clo</div>
					{filteredMoods.length > pageSize && (
						<CustomPagination
							breakLabel='...'
							nextLabel='Next'
							onPageChange={handlePagination}
							pageRangeDisplayed={5}
							pageCount={Math.ceil(filteredMoods.length / pageSize)}
							previousLabel='Prev'
							containerClassName='flex items-end gap-1 py-2  px-5'
							activeClassName='button--primary rounded-full text-white'
							pageLinkClassName='px-3 pt-[2px]'
							disabledClassName='opacity-50 cursor-not-allowed'
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Rightbar;
