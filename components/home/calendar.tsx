'use client';
import React, { useState, useEffect } from 'react';
import NewLogPopup, { ReflectionsType } from './newLogPopup';
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
import todayIcon from '/public/moods/today.svg';

import '/app/styles/calendar.css';
import { init } from 'next/dist/compiled/webpack/webpack';
import { Win } from './moodPrompts';
import { on } from 'events';

type Props = {
	month: number;
	setMonth: React.Dispatch<React.SetStateAction<number>>;
	handleAddLogClick: () => void;
	selectedDate: Value;
	value: Value | null;
	setValue: React.Dispatch<React.SetStateAction<Value | null>>;
	isPopupOpen: boolean;
	setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleDateChange: (newValue: Value) => void;
	handleLogClick: (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
		favorite: boolean;
		wins?: Win[];
	}) => void;
	onLoadComplete?: () => void;
	mobile?: boolean;
};
type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type MoodEntry = {
	date: string;
	mood: string;
	reflections: ReflectionsType[];
	favorite: boolean;
	wins: Win[];
};

const CalendarView = ({
	month,
	setMonth,
	handleAddLogClick,
	selectedDate,
	value,
	setValue,
	isPopupOpen,
	setPopupOpen,
	handleDateChange,
	handleLogClick,
	onLoadComplete,
	mobile,
}: Props) => {
	const { user, updateData, isUpdated } = useAuth();
	const [moods, setMoods] = useState<{
		[key: string]: {
			mood: string;
			reflections: ReflectionsType[];
			favorite: boolean;
			wins: Win[];
		};
	}>({});
	const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
	const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
	const [selectedIconDate, setSelectedIconDate] = useState<string | null>(null);

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
						};
					});
					setMoods(moodMap);
					onLoadComplete && onLoadComplete();
				} else {
					onLoadComplete && onLoadComplete();
				}
			});
		}
	}, [user, isUpdated]);

	useEffect(() => {
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

		if (isYearDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isYearDropdownOpen]);

	useEffect(() => {
		setDisplayedYear((selectedDate as Date).getFullYear());
	}, [selectedDate]);

	const saveMood = async (
		date: string,
		mood: string,
		reflections: ReflectionsType[],
		favorite: boolean,
		wins: Win[]
	) => {
		if (user) {
			console.log(date);
			await addUserMood(user.uid, mood, date, reflections, favorite, wins);
			updateData();
			const dateParts = date.split('-').map((part) => parseInt(part, 10));
			const logDate = new Date(
				dateParts[0],
				dateParts[1] - 1,
				dateParts[2],
				0,
				0,
				0
			);

			// Call handleLogClick after the new log is saved
			handleLogClick({
				date: logDate,
				mood: mood,
				icon: `/moods/${mood.toLowerCase()}.svg`,
				reflections: reflections,
				favorite: favorite,
				wins: wins,
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

	const iconSize = mobile ? 8 : 16;
	return (
		<div className='big-calendar cal-container'>
			<div className='flex max-h-24 flex-col gap-5'>
				<div className='flex h-12 w-full flex-row items-center justify-between font-semibold'>
					<div className='calendar-nav flex flex-row gap-2'>
						<span
							className={`calendar-heading align-center flex cursor-pointer justify-center gap-[0.625rem] rounded-lg px-3 py-1 text-2xl ${
								isYearDropdownOpen ? 'bg-[#dee9f5]' : ''
							} ${mobile ? '!text-xl' : 'text-2xl'}`}
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
										<div
											className={`flex items-center justify-center text-[#706F6F] ${mobile ? 'gap-8' : 'gap-3'}`}
										>
											<button
												className='hover:text-primary'
												onClick={(event) => incrementYear(event)}
											>
												<ArrowUp size={iconSize} />
											</button>
											<button
												className='hover:text-primary'
												onClick={(event) => decrementYear(event)}
											>
												<ArrowDown size={iconSize} />
											</button>
										</div>
									</div>
									<div className='calendar-dropdown-months'>
										{Array.from({ length: 12 }, (_, i) => i).map((month) => (
											<button
												key={month}
												className={`calendar-dropdown-item ${
													new Date(selectedDate as Date).getMonth() === month
														? 'selected-month'
														: ''
												}`}
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
						<button onClick={() => changeMonth(-1)}>
							<CaretLeft weight='bold' className='text-primary' />
						</button>
						<button onClick={() => changeMonth(1)}>
							<CaretRight weight='bold' className='text-primary' />
						</button>
					</div>
					<div className='flex flex-row gap-6'>
						{/* Add Log Button for Mobile */}
						{mobile && (
							<button
								onClick={handleAddLogClick}
								className='flex min-w-fit items-center justify-center gap-2 rounded-[1.25rem] border border-[#2D81E0] bg-[#2D81E0] px-6 py-1 text-sm font-bold text-white'
							>
								<div>
									<Plus />
								</div>
								<div className='m-0 flex content-center items-center justify-center p-0 leading-none'>
									Add a Log
								</div>
							</button>
						)}

						<div className='flex w-fit cursor-pointer flex-row items-center justify-center gap-4'>
							<div
								className='background-white flex min-w-fit items-center justify-center rounded-[1.25rem] border border-[#2D81E0] px-6 py-1 text-sm font-bold text-primary '
								onClick={() => {
									const today = new Date();
									handleDateChange(today);
									setMonth(today.getMonth());
									const todayKey = formatValueTypeToYYYYMMDD(today);
									handleLogClick({
										date: today,
										mood: moods[todayKey]?.mood || '',
										icon: moods[todayKey]
											? `/moods/${moods[todayKey].mood.toLowerCase()}.svg`
											: '/moods/greyWithFace.svg',
										reflections: moods[todayKey]?.reflections || [],
										favorite: moods[todayKey]?.favorite || false,
										wins: moods[todayKey]?.wins || [],
									});
									setSelectedIconDate(todayKey);
								}}
							>
								Today
							</div>
						</div>
					</div>
				</div>
				<div className=' h-[0.125rem] bg-[#dee9f5]'></div>
			</div>
			<Calendar
				key={`${
					selectedDate instanceof Date ? selectedDate : new Date()
				}.getMonth()}-${
					selectedDate instanceof Date ? selectedDate : new Date()
				}.getFullYear()`}
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
							<Image
								src={`/moods/greyNoFace.svg`}
								alt='Mood'
								height={150}
								width={150}
								onClick={() => {
									handleLogClick({
										date: date,
										mood: moods[dateKey]?.mood || '',
										icon: '/moods/greyNoFace.svg',
										reflections: moods[dateKey]?.reflections || [],
										favorite: moods[dateKey]?.favorite || false,
										wins: moods[dateKey]?.wins || [],
									});
									setSelectedIconDate(dateKey);
								}}
							/>
						);
					}
					const moodIcon = moods[dateKey]
						? `/moods/${moods[dateKey].mood.toLowerCase()}.svg`
						: isDateToday
							? todayIcon
							: '/moods/greyWithFace.svg';

					const selectedMoodIcon = moods[dateKey]
						? `/moods/selected-${moods[dateKey].mood.toLowerCase()}.svg`
						: isDateToday
							? todayIcon
							: '/moods/selected-greyWithFace.svg';

					console.log('Mood Icon:', moodIcon); // Debug log
					console.log('Selected Mood Icon:', selectedMoodIcon); // Debug log

					return (
						<Image
							src={selectedIconDate === dateKey ? selectedMoodIcon : moodIcon}
							alt='Mood'
							height={150}
							width={150}
							onClick={() => {
								handleLogClick({
									date: date,
									mood: moods[dateKey]?.mood || 'No Log Yet',
									icon:
										selectedIconDate === dateKey ? selectedMoodIcon : moodIcon,
									reflections: moods[dateKey]?.reflections || [],
									favorite: moods[dateKey]?.favorite || false,
									wins: moods[dateKey]?.wins || [],
								});
								setSelectedIconDate(dateKey);
							}}
						/>
					);
				}}
				tileClassName={({ date, view }) => {
					if (isToday(date)) {
						return 'react-calendar__tile--today';
					}
					if (
						date.getDate() === (selectedDate as Date).getDate() &&
						date.getMonth() === (selectedDate as Date).getMonth() &&
						date.getFullYear() === (selectedDate as Date).getFullYear()
					) {
						return 'react-calendar__tile--selected';
					}
					return '';
				}}
				tileDisabled={({ date, view }) =>
					date.getFullYear() > todayYear ||
					(date.getFullYear() === todayYear && date.getMonth() > todayMonth) ||
					(date.getFullYear() === todayYear &&
						date.getMonth() === todayMonth &&
						date.getDate() > todayDate)
				}
			/>
			<NewLogPopup
				isPopupOpen={isPopupOpen}
				selectedDate={formatValueTypeToYYYYMMDD(selectedDate as Date)}
				displayDate={formatDateToDayMonthDateYear(selectedDate as Date)}
				saveMood={saveMood}
				setPopupOpen={setPopupOpen}
				handleLogClick={handleLogClick}
				mobile={mobile}
			/>
		</div>
	);
};

export default CalendarView;
