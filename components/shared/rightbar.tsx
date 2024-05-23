import { useAuth } from '@/app/context/UserProvider';
import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/serverFunctions';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import { MoodEntry, Value } from '../home/calendar';
import Image from 'next/image';
import LogSummaryList from './logSummaryList';
import { ReflectionsType } from '../home/newLogPopup';
import CustomPagination from './customPagination';

interface RightbarProps {
	isRightBarOpen: boolean;
	onToggle: (open: boolean) => void;
	handleLogClick: (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
	}) => void;
	selectedDate: Value;
	value: Value | null;
	setValue: React.Dispatch<React.SetStateAction<Value | null>>;
	handleDateChange: (newValue: Value) => void;
	currentPage: number;
	handlePagination: (value: { selected: number }) => void;
	month?: number;
	isSummaryList: boolean;

	children?: React.ReactNode;
}

const Rightbar: React.FC<RightbarProps> = ({
	isRightBarOpen,
	onToggle,
	handleLogClick,
	selectedDate,
	value,
	setValue,
	handleDateChange,
	currentPage,
	handlePagination,
	month,
	isSummaryList,
	children,
}) => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<{
		[key: string]: { mood: string; reflections: ReflectionsType[] };
	}>({});
	useEffect(() => {
		if (user) {
			getUser(user.uid);
		}
	}, [user, isUpdated]);

	const [selectedFilters, setSelectedFilters] = useState({
		Rainbow: false,
		Sunny: false,
		Cloudy: false,
		Rainy: false,
		Stormy: false,
	});
	const currentDate = new Date();
	const currentMonth = month;
	const currentYear = currentDate.getUTCFullYear();

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

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData) => {
				if (userData && userData.moods) {
					let moodMap: {
						[key: string]: { mood: string; reflections: ReflectionsType[] };
					} = {};

					userData.moods.forEach((moodEntry: MoodEntry) => {
						const dateParts = moodEntry.date
							.split('-')
							.map((part) => parseInt(part, 10));
						const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
						moodMap[formatValueTypeToYYYYMMDD(date)] = {
							mood: moodEntry.mood,
							reflections: moodEntry.reflections,
						}; // Update this line
					});
					setMoods(moodMap);
				}
			});
		}
	}, [user, isUpdated, month]);

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
							handleLogClick={handleLogClick}
							selectedDate={selectedDate}
							value={value}
							setValue={setValue}
							handleDateChange={handleDateChange}
							currentPage={currentPage}
							handlePagination={handlePagination}
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

							{isSummaryList && filteredMoods.length > pageSize && (
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
