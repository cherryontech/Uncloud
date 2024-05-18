'use client';
import React, { useState, useEffect } from 'react';
import NewLogPopup from './newLogPopup';
import Calendar from 'react-calendar';
import { getUser, addUserMood } from '../utils/serverFunctions';
import {
	formatValueTypeToYYYYMMDD,
	formatDateToDayMonthDateYear,
	formatDateToYear,
	formatDateToMonth,
	isToday,
} from '../utils/reusableFunctions';
import Image from 'next/legacy/image';
import { useAuth } from '@/app/context/UserProvider';
import { Button } from '@/stories/Button';
import {
	Plus,
	CaretLeft,
	CaretRight,
	ArrowUp,
	ArrowDown,
} from '@phosphor-icons/react';

import '/app/styles/calendar.css';

type Props = {
	month: number;
	setMonth: React.Dispatch<React.SetStateAction<number>>;
	handleAddLogClick: () => void;
	selectedDate: Value;
	value: Value | null;
	setValue: React.Dispatch<React.SetStateAction<Value | null>>;
	isPopupOpen: boolean;
	handlePopupToggle: () => void;
	setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleDateChange: (newValue: Value) => void;
};
type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type MoodEntry = {
	date: string;
	mood: string;
};

const CalendarView = ({
	month,
	setMonth,
	handleAddLogClick,
	selectedDate,
	value,
	setValue,
	isPopupOpen,
	handlePopupToggle,
	setPopupOpen,
	handleDateChange,
}: Props) => {
	const { user, updateData, isUpdated } = useAuth();
	const [moods, setMoods] = useState<{ [key: string]: string }>({});
	const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
	const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

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

	const saveMood = (mood: string, date: string) => {
		if (user) {
			addUserMood(user.uid, mood, date).then(() => {
				setMoods((prev) => ({ ...prev, [date]: mood }));
				updateData();
			});
		}
	};

	const today = new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();

	const changeMonth = (offset: number) => {
		const newDate = new Date(selectedDate as Date);
		newDate.setMonth(newDate.getMonth() + offset);
		handleDateChange(newDate);
	};

	const changeYear = () => {
		setYearDropdownOpen((prev) => !prev);
	};

	const handleYearSelect = (year: number, event: React.MouseEvent) => {
		event.stopPropagation();
		const newDate = new Date(selectedDate as Date);
		newDate.setFullYear(year);
		handleDateChange(newDate);
		setYearDropdownOpen(false);
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

	return (
		<div className='flex flex-col justify-start gap-6'>
			<div className='flex w-full flex-row items-center justify-between font-semibold'>
				<div className='calendar-nav flex flex-row gap-2'>
					<button onClick={() => changeMonth(-1)}>
						<CaretLeft weight='bold' className='text-primary' />
					</button>
					<span
						className={`calendar-heading align-center flex cursor-pointer justify-center gap-[0.625rem] rounded-lg px-3 py-1 text-2xl ${isYearDropdownOpen ? 'bg-[#dee9f5]' : ''}`}
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
											<ArrowUp size={16} />
										</button>
										<button
											className='hover:text-primary'
											onClick={(event) => decrementYear(event)}
										>
											<ArrowDown size={16} />
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
					<button onClick={() => changeMonth(1)}>
						<CaretRight weight='bold' className='text-primary' />
					</button>
				</div>

				<div className='flex w-fit cursor-pointer flex-row items-center justify-center gap-4'>
					<div
						className='background-white flex min-w-fit items-center justify-center rounded-[1.25rem] border border-[#2D81E0] px-6 py-1 text-sm font-bold text-primary '
						onClick={() => {
							const today = new Date();
							handleDateChange(today);
							setMonth(today.getMonth());
						}}
					>
						Today
						{/* {isToday(selectedDate as Date)
							? 'Today'
							: formatDateToDayMonthDateYear(selectedDate as Date)} */}
					</div>
				</div>
			</div>
			<div className=' mb-[0.5rem] mt-[0.1rem] h-[0.125rem] bg-[#dee9f5]'></div>
			<div>
				<Calendar
					key={`${(selectedDate instanceof Date ? selectedDate : new Date()).getMonth()}-${(selectedDate instanceof Date ? selectedDate : new Date()).getFullYear()}`}
					calendarType='gregory'
					onChange={handleDateChange}
					showNeighboringMonth={true}
					showNavigation={false}
					value={selectedDate}
					tileContent={({ date, view }) => {
						const dateKey = formatValueTypeToYYYYMMDD(date);
						const isDateToday = isToday(date);
						if (
							date.getFullYear() > todayYear ||
							(date.getFullYear() === todayYear &&
								date.getMonth() > todayMonth) ||
							(date.getFullYear() === todayYear &&
								date.getMonth() === todayMonth &&
								date.getDate() > todayDate)
						) {
							return (
								<div className='relative h-full w-full'>
									<Image
										src={`/moods/greyNoFace.svg`}
										alt='Mood'
										layout='fill'
									/>
								</div>
							);
						}
						return moods[dateKey] ? (
							<div className='relative h-full w-full'>
								<Image
									src={`/moods/${moods[dateKey].toLowerCase()}.svg`}
									alt='Mood'
									layout='fill'
								/>
							</div>
						) : (
							<div className='relative h-full w-full'>
								<Image
									src={`/moods/greyWithFace.svg`}
									alt='Mood'
									layout='fill'
								/>
							</div>
						);
					}}
					tileDisabled={({ date, view }) =>
						date.getFullYear() > todayYear ||
						(date.getFullYear() === todayYear &&
							date.getMonth() > todayMonth) ||
						(date.getFullYear() === todayYear &&
							date.getMonth() === todayMonth &&
							date.getDate() > todayDate)
					}
				/>
			</div>
			<NewLogPopup
				isPopupOpen={isPopupOpen}
				handlePopupToggle={handlePopupToggle}
				selectedDate={formatValueTypeToYYYYMMDD(selectedDate as Date)}
				displayDate={formatDateToDayMonthDateYear(selectedDate as Date)}
				saveMood={saveMood}
				setPopupOpen={setPopupOpen}
			/>
		</div>
	);
};

export default CalendarView;
