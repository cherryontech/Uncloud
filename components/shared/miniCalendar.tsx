import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

import { useAuth } from '@/app/context/UserProvider';
import { getUser, addUserMood } from '../utils/serverFunctions';
import '/app/styles/miniCalendar.css';
import {
	CaretUp,
	CaretDown,
	CaretLeft,
	CaretRight,
	ArrowUp,
	ArrowDown,
} from '@phosphor-icons/react';
import {
	formatValueTypeToYYYYMMDD,
	formatDateToDayMonthDateYear,
	formatDateToYear,
	formatDateToMonth,
	isToday,
} from '../utils/reusableFunctions';

type Props = {
	month: number;
	setMonth: React.Dispatch<React.SetStateAction<number>>;
	selectedDate: Value;
	value: Value | null;
	setValue: React.Dispatch<React.SetStateAction<Value | null>>;
	handleDateChange: (newValue: Value) => void;
	handleLogClick: (log: { date: Date; mood: string; icon: string }) => void;
};

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

const MiniCalendarView = ({
	month,
	setMonth,
	selectedDate,
	value,
	setValue,
	handleDateChange,
	handleLogClick,
}: Props) => {
	const { user } = useAuth();
	const [moods, setMoods] = useState<{ [key: string]: string }>({});
	const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
	const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
	const today = new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();

	type MoodEntry = {
		date: string;
		mood: string;
	};

	type Mood = 'Rainbow' | 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';

	type MoodColors = {
		[mood in Mood]: string;
	};

	const colors: MoodColors = {
		Rainbow: '#F9C7D7',
		Sunny: '#FFE773',
		Cloudy: '#B1D5D5',
		Rainy: '#A0D1F9',
		Stormy: '#AA52BF',
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
	}, [user]);

	useEffect(() => {
		// Function to check if clicked outside of dropdown
		const handleClickOutside = (event: MouseEvent) => {
			const dropdownElement = document.querySelector('.calendar-dropdown');
			const headingElement = document.querySelector('.calendar-heading');
			if (
				dropdownElement &&
				!dropdownElement.contains(event.target as Node) &&
				headingElement !== event.target
			) {
				setYearDropdownOpen(false);
			}
		};

		// Add event listener when dropdown is open
		if (isYearDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		// Cleanup function to remove event listener when dropdown is closed
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isYearDropdownOpen]);

	useEffect(() => {
		setDisplayedYear((selectedDate as Date).getFullYear());
	}, [selectedDate]);

	const changeMonth = (offset: number) => {
		const newDate = new Date(selectedDate as Date);
		newDate.setMonth(newDate.getMonth() + offset);
		handleDateChange(newDate);
	};

	const changeYear = () => {
		setYearDropdownOpen((prev) => !prev);
	};

	const incrementYear = (event: React.MouseEvent) => {
		event.stopPropagation();
		setDisplayedYear((prevYear) => prevYear + 1);
		const newDate = new Date(selectedDate as Date);
		newDate.setFullYear(newDate.getFullYear() + 1);
		handleDateChange(newDate);
	};

	const decrementYear = (event: React.MouseEvent) => {
		event.stopPropagation();
		setDisplayedYear((prevYear) => prevYear - 1);
		const newDate = new Date(selectedDate as Date);
		newDate.setFullYear(newDate.getFullYear() - 1);
		handleDateChange(newDate);
	};

	const handleMonthSelect = (month: number, event: React.MouseEvent) => {
		event.stopPropagation();
		const newDate = new Date(selectedDate as Date);
		newDate.setMonth(month);
		newDate.setFullYear(displayedYear);
		handleDateChange(newDate);
		setYearDropdownOpen(false);
		setMonth(month);
	};

	return (
		<div className='mini-calendar flex w-full flex-col gap-4 rounded-xl border-[1px] border-[#DEE9F5] bg-white p-3'>
			<div className='calendar-nav flex flex-row justify-between gap-2 pr-2'>
				<span
					className={`calendar-heading align-center flex cursor-pointer justify-center gap-[0.625rem] rounded-lg px-3 py-1 text-base font-semibold ${isYearDropdownOpen ? 'bg-[#dee9f5]' : ''}`}
					onClick={changeYear}
				>
					{formatDateToMonth(selectedDate as Date)}{' '}
					{formatDateToYear(selectedDate as Date)}
					{isYearDropdownOpen ? (
						<div className='calendar-dropdown'>
							<div className='calendar-dropdown-year'>
								<span className='text-sm font-semibold text-black'>
									{displayedYear}
								</span>
								<div className='flex items-center justify-center gap-3 text-[#706F6F]'>
									<button
										className='hover:text-primary'
										onClick={(event) => incrementYear(event)}
									>
										<CaretUp size={16} />
									</button>
									<button
										className='hover:text-primary'
										onClick={(event) => decrementYear(event)}
									>
										<CaretDown size={16} />
									</button>
								</div>
							</div>
							<div className='calendar-dropdown-months'>
								{Array.from({ length: 12 }, (_, i) => i).map((month) => (
									<button
										key={month}
										className={`calendar-dropdown-item ${new Date(selectedDate as Date).getMonth() === month ? 'selected-month' : ''}`}
										onClick={(event) => handleMonthSelect(month, event)}
									>
										{new Date(0, month).toLocaleString('default', {
											month: 'short',
										})}
									</button>
								))}
							</div>
						</div>
					) : null}
				</span>
				<div className='flex items-center justify-center gap-6'>
					<button onClick={() => changeMonth(-1)}>
						<CaretLeft weight='bold' className='text-primary' />
					</button>
					<button onClick={() => changeMonth(1)}>
						<CaretRight weight='bold' className='text-primary' />
					</button>
				</div>
			</div>
			<Calendar
				formatShortWeekday={(locale, date) =>
					date.toLocaleString(locale, { weekday: 'narrow' })
				}
				key={`${(selectedDate instanceof Date ? selectedDate : new Date()).getMonth()}-${(selectedDate instanceof Date ? selectedDate : new Date()).getFullYear()}`}
				calendarType='gregory'
				onChange={handleDateChange}
				showNeighboringMonth={true}
				showNavigation={false}
				value={selectedDate}
				onClickDay={(value: Date) => {
					const dateKey = formatValueTypeToYYYYMMDD(value);
					const mood = moods[dateKey];
					const icon = mood
						? `/moods/${mood.toLowerCase()}.svg`
						: '/moods/greyWithFace.svg';
					if (mood) {
						handleLogClick({ date: value, mood, icon });
					}
				}}
				tileContent={({ date, view }) => {
					const dateKey = formatValueTypeToYYYYMMDD(date);
					const mood = moods[dateKey]; // Check if a mood is logged for this date
					const backgroundColor =
						mood && colors.hasOwnProperty(mood)
							? colors[mood as Mood]
							: 'transparent';
					const icon = mood
						? `/moods/${mood.toLowerCase()}.svg`
						: '/moods/greyWithFace.svg';
					return (
						<span
							className='mb-1 flex h-[0.25rem] w-[0.25rem] rounded-full'
							style={{ backgroundColor }}
						></span>
					);
				}}
				tileDisabled={({ date, view }) =>
					date.getFullYear() > todayYear ||
					(date.getFullYear() === todayYear && date.getMonth() > todayMonth) ||
					(date.getFullYear() === todayYear &&
						date.getMonth() === todayMonth &&
						date.getDate() > todayDate)
				}
			/>
		</div>
	);
};

export default MiniCalendarView;
