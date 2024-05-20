'use client';
import { useAuth } from '@/app/context/UserProvider';
import { UserProvider } from './context/UserProvider';
import { useState, useCallback, SetStateAction } from 'react';
import { Value } from '@/components/home/calendar';
import FAQ from '@/components/pages/faq';
import Goals from '@/components/pages/goals';
import Trends from '@/components/pages/trends';
import Favorites from '@/components/pages/favorites';
import CalendarView from '@/components/home/calendar';
import Userbar from '@/components/shared/userbar';
import Leftbar from '@/components/shared/leftbar';
import Rightbar from '@/components/shared/rightbar';
import LogSummary from '@/components/shared/logSummary';
import MiniCalendarView from '@/components/shared/miniCalendar';
import LogSummaryList from '@/components/shared/logSummaryList';

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
	const [isRightBarOpen, setRightBarOpen] = useState(true);
	const [selectedLog, setSelectedLog] = useState<{
		date: Date;
		mood: string;
		icon: string;
	} | null>(null);
	const [rightBarContent, setRightBarContent] = useState<JSX.Element | null>(
		null
	);
	const [rightBarHistory, setRightBarHistory] = useState<JSX.Element[]>([]);
	const handleLogClick = (log: { date: Date; mood: string; icon: string }) => {
		setRightBarHistory((prevHistory) =>
			rightBarContent ? [...prevHistory, rightBarContent] : prevHistory
		);
		setRightBarContent(<LogSummary log={log} handleGoBack={handleGoBack} />);
		setRightBarOpen(true);
	};

	const handleGoBack = () => {
		console.log('Go back clicked');
		setRightBarHistory((prevHistory) => {
			const newHistory = prevHistory.filter((item) => item !== null);
			const lastContent = newHistory.pop();
			if (lastContent !== undefined) {
				setRightBarContent(lastContent);
			}
			return newHistory;
		});
	};

	const handleRightBarToggle = (open: boolean) => {
		setRightBarOpen(open);
	};

	const handlePopupToggle = useCallback(() => {
		setPopupOpen((prev) => !prev);
		console.log('Popup state toggled:', !isPopupOpen);
	}, [isPopupOpen]);

	const handleAddLogClick = useCallback(() => {
		setValue(selectedDate); // Use the selected date here
		setPopupOpen(true); // Directly set the popup to open
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
					month={month}
					setMonth={setMonth}
					handleAddLogClick={handleAddLogClick}
					selectedDate={selectedDate}
					value={value}
					setValue={setValue}
					isPopupOpen={isPopupOpen}
					setPopupOpen={setPopupOpen}
					handleDateChange={handleDateChange}
					handleLogClick={handleLogClick}
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
				setPopupOpen={setPopupOpen}
					handleDateChange={handleDateChange}
					handleLogClick={handleLogClick}
				/>
			);
	}
	console.log('User', user);
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
							handleLogClick={handleLogClick}
						/>
					}
				/>
			</div>
			<div className={`main-container bg-[#F3F5F9]`}>
				<div className='col-span-1 flex h-16 w-full flex-row items-center justify-start'>
					<span className='text-3xl font-semibold'>My Log</span>
				</div>

				<Userbar />

				<div
					className={`content ${isRightBarOpen ? 'right-bar-open' : 'right-bar-collapsed'}`}
				>
					<div className='main-content flex flex-col items-center  bg-[#F3F5F9]'>
						<div className='h-full w-full rounded-2xl bg-white  px-4 py-6'>
							<UserProvider>{component}</UserProvider>
						</div>
					</div>
					<Rightbar
						isRightBarOpen={isRightBarOpen}
						onToggle={handleRightBarToggle}
					>
						{rightBarContent}
					</Rightbar>
				</div>
			</div>
		</div>
	);
}
