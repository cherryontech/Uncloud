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
import LogSummaryList from './logSummaryList';

type Props = {
	isRightBarOpen: boolean;
	onToggle: (isOpen: boolean) => void;
};
interface RightbarProps {
	isRightBarOpen: boolean;
	onToggle: (open: boolean) => void;
	children?: React.ReactNode; // Add this line
}

export type MoodNames = {
	[key: string]: string;
};
const Rightbar: React.FC<RightbarProps> = ({
	isRightBarOpen,
	onToggle,
	children,
}) => {
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
		<div
			className={`right-bar flex h-full w-full flex-col gap-4 rounded-2xl bg-white  py-6 ${isRightBarOpen ? 'px-5' : 'px-2'}`}
		>
			{isRightBarOpen ? (
				<div className='right-bar-container h-full'>
					{/* Content */}
					{children ? (
						children
					) : (
						<LogSummaryList
							currentMoods={currentMoods}
							handleCheckboxChange={handleCheckboxChange}
							selectedFilters={selectedFilters}
							moodNames={moodNames}
							handlePagination={handlePagination}
							filteredMoods={filteredMoods}
							pageSize={pageSize}
							onToggle={onToggle}
							isRightBarOpen={isRightBarOpen}
						/>
					)}

					{/* Bottom Bar */}
					<div className='flex flex-col gap-2 pt-4'>
						<div className='h-[0.125rem] bg-[#dee9f5]'></div>
						<div className='flex min-h-8 items-center justify-between'>
							<button onClick={() => onToggle(!isRightBarOpen)}>
								<Image
									src='/phosphor-icons/SidebarSimple.svg'
									alt='Sidebar Icon'
									width={24}
									height={24}
									color='white'
								/>
							</button>

							{filteredMoods.length > pageSize && (
								<CustomPagination
									breakLabel='...'
									nextLabel='Next'
									onPageChange={handlePagination}
									pageRangeDisplayed={5}
									pageCount={Math.ceil(filteredMoods.length / pageSize)}
									previousLabel='Prev'
									containerClassName='flex items-end gap-2 py-2  px-5 h-fit w-full justify-end items-center'
									activeClassName='button--primary rounded-full text-white w-8 h-8'
									pageLinkClassName='flex items-center justify-center text-sm'
									disabledClassName='opacity-50 cursor-not-allowed'
									previousClassName='text-sm'
									nextClassName='text-sm'
								/>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className='flex h-full w-full min-w-8 items-end justify-center'>
					<div className='h-[0.125rem] bg-[#dee9f5]'></div>
					<div className='flex min-h-8 items-center justify-between'>
						<button onClick={() => onToggle(!isRightBarOpen)}>
							<Image
								src='/phosphor-icons/SidebarSimple.svg'
								alt='Sidebar Icon'
								width={24}
								height={24}
								color='white'
							/>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Rightbar;
