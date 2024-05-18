'use client';
import { useAuth } from '@/app/context/UserProvider';
import { UserProvider } from './context/UserProvider';
import { useState, useCallback } from 'react';
import { Value } from '@/components/home/calendar';
import FAQ from '@/components/pages/faq';
import Goals from '@/components/pages/goals';
import Trends from '@/components/pages/trends';
import Favorites from '@/components/pages/favorites';
import CalendarView from '@/components/home/calendar';
import Userbar from '@/components/shared/userbar';
import Leftbar from '@/components/shared/leftbar';
import Rightbar from '@/components/shared/rightbar';
import MiniCalendarView from '@/components/shared/miniCalendar';

export default function MainComponent({
	children,
}: Readonly<{
	children?: React.ReactNode;
}>) {
	const { user } = useAuth();
	const [selectedMenuItem, setSelectedMenuItem] = useState('Calendar');
	const [selectedDate, setSelectedDate] = useState<Value>(new Date());
	const [value, setValue] = useState<Value | null>(new Date());
	const [isPopupOpen, setPopupOpen] = useState(false);
	const [month, setMonth] = useState(new Date().getMonth());

	const handlePopupToggle = useCallback(() => {
		setPopupOpen((prev) => !prev);
		console.log('Popup state toggled:', !isPopupOpen);
	}, [isPopupOpen]);

	const handleAddLogClick = useCallback(() => {
		setValue(selectedDate); // Use the selected date here
		setPopupOpen(true); // Directly set the popup to open
		console.log('Popup opened');
	}, [selectedDate]);

	const handleDateChange = (newValue: Value) => {
		setSelectedDate(newValue); // Ensure selectedDate is updated
		setValue(newValue);
	};

	let component;
	switch (selectedMenuItem) {
		case 'Calendar':
			component = (
				<CalendarView
					// key={selectedDate ? selectedDate.toString() : 'default-key'}
					month={month}
					setMonth={setMonth}
					handleAddLogClick={handleAddLogClick}
					selectedDate={selectedDate}
					value={value}
					setValue={setValue}
					isPopupOpen={isPopupOpen}
					handlePopupToggle={handlePopupToggle}
					setPopupOpen={setPopupOpen}
					handleDateChange={handleDateChange} // Pass handleDateChange as a prop
				/>
			);
			break;
		case 'FAQ':
			component = <FAQ />;
			break;
		case 'Goals':
			component = <Goals />;
			break;
		case 'Trends':
			component = <Trends />;
			break;
		case 'Favorites':
			component = <Favorites />;
			break;
		default:
			component = (
				<CalendarView
					month={month}
					setMonth={setMonth}
					handleAddLogClick={handleAddLogClick}
					selectedDate={selectedDate}
					value={value}
					setValue={setValue}
					isPopupOpen={isPopupOpen}
					handlePopupToggle={handlePopupToggle}
					setPopupOpen={setPopupOpen}
					handleDateChange={handleDateChange} // Pass handleDateChange as a prop
				/>
			);
	}
	console.log(user);
	return (
		<div className='grid-container'>
			<div className='sidebar border-r-[0.0625rem] border-[#D9D9D9]'>
				<Leftbar
					setSelectedMenuItem={setSelectedMenuItem}
					selectedMenuItem={selectedMenuItem}
					handleAddLogClick={handleAddLogClick}
					MiniCalendar={
						<MiniCalendarView
							month={month}
							setMonth={setMonth}
							selectedDate={selectedDate}
							value={value}
							setValue={setValue}
							handleDateChange={handleDateChange}
						/>
					}
				/>
			</div>
			<div className='main-container bg-[#F3F5F9] py-2'>
				<div className='col-span-1 flex h-16 w-full flex-row items-center justify-start'>
					<span className='text-3xl font-semibold'>My Log</span>
				</div>

				<Userbar />

				<div className='main-content flex flex-col items-center  bg-[#F3F5F9] pb-6'>
					<div className='h-full w-full rounded-2xl bg-white p-6'>
						<Component />
					</div>
				</div>
				<div className='mainRightBar'>
					<Rightbar />
				</div>
			</div>
		</div>
	);
}
