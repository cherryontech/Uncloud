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
import Image from "next/legacy/image";
import { useAuth } from '@/app/context/UserProvider';
import { Button } from '@/stories/Button';
import { Plus } from '@phosphor-icons/react';

type Props = {};
type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];
const CalendarView = (props: Props) => {
	const { user } = useAuth();
	const [showPopup, setShowPopup] = useState(false);
	const [value, setValue] = useState<Value>(new Date());
	const [moods, setMoods] = useState<{ [key: string]: string }>({});
	const [selectedDate, setSelectedDate] = useState<Value>(new Date());

	type MoodEntry = {
		date: string;
		mood: string;
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

	const handlePopupToggle = () => {
		setShowPopup(!showPopup);
	};

	const handleDateChange = (newValue: Value) => {
		setSelectedDate(newValue);
		setValue(newValue);
	};

	const handleAddLogClick = () => {
		setValue(selectedDate); // Use the selected date here
		handlePopupToggle();
	};

	const saveMood = (mood: string, date: string) => {
		if (user) {
			addUserMood(user.uid, mood, date).then(() => {
				setMoods((prev) => ({ ...prev, [date]: mood }));
				setShowPopup(false);
			});
		}
	};
	const today = new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();
	return (
		<div className='flex flex-col justify-start gap-6'>
			<div className='flex w-full flex-row items-center justify-between font-semibold'>
				<span className='text-2xl'>
					{formatDateToMonth(value as Date)} {formatDateToYear(value as Date)}
				</span>
				<div className='flex w-fit flex-row items-center justify-center gap-4'>
					<div className='background-white flex min-w-fit items-center justify-center rounded-[1.25rem] border border-[#2D81E0] px-6 py-1 text-sm font-bold text-primary '>
						{isToday(selectedDate as Date)
							? 'Today'
							: formatDateToDayMonthDateYear(selectedDate as Date)}
					</div>
					<Button
						type='button'
						label={
							<span
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '5px',
								}}
							>
								<Plus />
								<div className='flex content-center items-center justify-center'>
									Add Log
								</div>
							</span>
						}
						primary
						onClick={handleAddLogClick}
						version='primary'
					/>
				</div>
			</div>

			<div>
				<Calendar
					calendarType='gregory'
					onChange={handleDateChange}
					showNeighboringMonth={true}
					showNavigation={false}
					value={value}
					tileContent={({ date, view }) => {
						const dateKey = formatValueTypeToYYYYMMDD(date);
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
				showPopup={showPopup}
				handlePopupToggle={handlePopupToggle}
				selectedDate={formatValueTypeToYYYYMMDD(value)}
				displayDate={formatDateToDayMonthDateYear(value as Date)}
				saveMood={saveMood}
			/>
		</div>
	);
};

export default CalendarView;
