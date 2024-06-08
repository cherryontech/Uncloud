'use client';
import { useAuth, UserProvider } from '@/app/context/UserProvider';
import { useEffect, useState, useCallback } from 'react';
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
import { ReflectionsType } from '@/components/home/newLogPopup';
import { getFavoriteLogs } from '@/components/utils/serverFunctions';
import { Win } from '@/components/home/moodPrompts';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Profile from '@/components/pages/profile';
import DesktopLayout from '@/components/home/desktopLayout';
import MobileLayout from '@/components/home/mobileLayout';

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
	const [isSummaryList, setIsSummaryList] = useState(true);
	const [isRightBarOpen, setRightBarOpen] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedLog, setSelectedLog] = useState<{
		date: Date;
		mood: string;
		icon: string;
	} | null>(null);

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [mobile, setMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
			setMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const [favoriteLogs, setFavoriteLogs] = useState<{
		[date: string]: {
			mood: string;
			reflections: ReflectionsType[];
			favorite: boolean;
		};
	}>({});

	const [profilePageOpen, setProfilePageOpen] = useState(false);

	useEffect(() => {
		const fetchFavoriteLogs = async () => {
			if (user) {
				const favoriteLogs = await getFavoriteLogs(user.uid);
				setFavoriteLogs(favoriteLogs);
			}
		};

		fetchFavoriteLogs();
	}, [user]);

	const onFavoriteToggle = (
		logDate: string,
		mood: string,
		reflections: ReflectionsType[]
	): boolean => {
		const newFavorite = !favoriteLogs[logDate]?.favorite;
		setFavoriteLogs((prevFavoriteLogs) => {
			let updatedFavoriteLogs = { ...prevFavoriteLogs };
			if (newFavorite) {
				updatedFavoriteLogs[logDate] = {
					mood,
					reflections,
					favorite: newFavorite,
				};
			} else {
				delete updatedFavoriteLogs[logDate];
			}
			return updatedFavoriteLogs;
		});
		return newFavorite;
	};

	const [rightBarContent, setRightBarContent] = useState<JSX.Element | null>(
		null
	);
	const [rightBarHistory, setRightBarHistory] = useState<JSX.Element[]>([]);

	const handleLogClick = (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
		favorite: boolean;
		wins?: Win[];
	}) => {
		setIsSummaryList(false);
		setRightBarHistory((prevHistory) =>
			rightBarContent ? [...prevHistory, rightBarContent] : prevHistory
		);
		setRightBarContent(
			<LogSummary
				log={{
					...log,
					reflections: log.reflections || [],
					wins: log.wins || [],
				}}
				handleGoBack={handleGoBack}
				onFavoriteToggle={onFavoriteToggle}
				favoriteLogs={favoriteLogs}
			/>
		);
		console.log('Checking date', log.date.toString());

		setRightBarOpen(true);
		console.log('Log clicked:', log);
	};

	const handleRightBarToggle = (open: boolean) => {
		setRightBarOpen(open);
	};

	const handleGoBack = () => {
		setIsSummaryList(true);
		setRightBarContent(null);
	};

	const handlePopupToggle = useCallback(() => {
		setPopupOpen((prev) => !prev);
		console.log('Popup state toggled:', !isPopupOpen);
	}, [isPopupOpen]);

	const handleAddLogClick = useCallback(() => {
		setValue(selectedDate);
		setPopupOpen(true);
	}, [selectedDate]);

	const handleDateChange = (newValue: Value) => {
		setSelectedDate(newValue);
		setValue(newValue);
	};

	let component;
	let title;
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
					onLoadComplete={() => setIsLoading(false)}
					mobile={mobile}
				/>
			);
			title = 'My Log';
			break;
		case 'FAQ':
			component = <FAQ />;
			title = 'FAQ';
			break;
		case 'Goals':
			component = <Goals />;
			title = 'Goals';
			break;
		case 'Trends':
			component = <Trends />;
			title = 'Overview';
			break;
		case 'Favorites':
			component = (
				<Favorites
					favoriteLogs={favoriteLogs}
					handleLogClick={handleLogClick}
					mobile={mobile}
				/>
			);
			title = 'Favorites';
			break;
		case 'Profile':
			component = <Profile mobile={mobile} />;
			title = 'Profile';
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
					onLoadComplete={() => setIsLoading(false)}
					mobile={mobile}
				/>
			);
			title = 'My Log';
	}

	const [currentPage, setCurrentPage] = useState(1);

	const handlePagination = (value: { selected: number }) => {
		setCurrentPage(value.selected + 1);
	};

	return (
		<>
			{windowWidth >= 768 ? (
				<DesktopLayout
					isLoading={isLoading}
					setSelectedMenuItem={setSelectedMenuItem}
					selectedMenuItem={selectedMenuItem}
					handleAddLogClick={handleAddLogClick}
					month={month}
					setMonth={setMonth}
					selectedDate={selectedDate}
					value={value}
					setValue={setValue}
					handleDateChange={handleDateChange}
					handleLogClick={handleLogClick}
					component={component}
					isRightBarOpen={isRightBarOpen}
					handleRightBarToggle={handleRightBarToggle}
					currentPage={currentPage}
					handlePagination={handlePagination}
					isSummaryList={isSummaryList}
					rightBarContent={rightBarContent}
					isPopupOpen={isPopupOpen}
					mobile={mobile}
					title={title}
				/>
			) : (
				// Mobile layout
				<MobileLayout
					isLoading={isLoading}
					setSelectedMenuItem={setSelectedMenuItem}
					selectedMenuItem={selectedMenuItem}
					handleAddLogClick={handleAddLogClick}
					month={month}
					setMonth={setMonth}
					selectedDate={selectedDate}
					value={value}
					setValue={setValue}
					handleDateChange={handleDateChange}
					handleLogClick={handleLogClick}
					component={component}
					isRightBarOpen={isRightBarOpen}
					handleRightBarToggle={handleRightBarToggle}
					currentPage={currentPage}
					handlePagination={handlePagination}
					isSummaryList={isSummaryList}
					rightBarContent={rightBarContent}
					isPopupOpen={isPopupOpen}
					mobile={mobile}
					title={title}
				/>
			)}
		</>
	);
}
