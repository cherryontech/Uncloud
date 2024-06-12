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
		handleDateChange: (newValue: Value) => void;

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

const FavoriteCalendarView = ({

	setMonth,

	selectedDate,
	
	handleDateChange,

	
	mobile,
}: Props) => {
	
	const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
	const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
	
	

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

	

	

	const changeMonth = (offset: number) => {
		const newDate = new Date(selectedDate as Date);
		newDate.setMonth(newDate.getMonth() + offset);
		handleDateChange(newDate);
	};

	const changeYear = () => {
		setYearDropdownOpen((prev) => !prev);
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
					
						<div className='flex w-fit cursor-pointer flex-row items-center justify-center gap-4'>
							<div
								className='background-white flex min-w-fit items-center justify-center rounded-[1.25rem] border border-[#2D81E0] px-6 py-1 text-sm font-bold text-primary '
							
							>
								Filters
							</div>
						</div>
					</div>
				</div>
				<div className=' h-[0.125rem] bg-[#dee9f5]'></div>
			</div>
			
		</div>
	);
};

export default FavoriteCalendarView;
