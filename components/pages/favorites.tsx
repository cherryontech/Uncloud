import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
	ArrowDown,
	ArrowUp,
	CaretLeft,
	CaretRight,
	Heart,
} from '@phosphor-icons/react';
import { ReflectionsType } from '@/components/home/newLogPopup';
import { Value } from '../home/calendar';
import {
	formatDateToMonth,
	formatDateToYear,
} from '../utils/reusableFunctions';
import { useAuth } from '@/app/context/UserProvider';
import { updateFavorite } from '../utils/serverFunctions';
import FilterDropdown from '../shared/filterDropdown';
import { useRouter } from 'next/navigation';

interface FavoriteLogsProps {
	favoriteLogs: {
		[date: string]: {
			mood: string;
			reflections: ReflectionsType[];
			favorite: boolean;
		};
	};
	handleLogClick: (
		log: {
			date: Date;
			mood: string;
			icon: string;
			reflections?: ReflectionsType[];
			favorite: boolean;
		},
		fromFavorites: boolean // Add fromFavorites argument
	) => void;
	mobile?: boolean;
	setMonth: React.Dispatch<React.SetStateAction<number>>;
	selectedDate: Value;
	handleDateChange: (newValue: Value) => void;
	month: number;
	onFavoriteToggle: (
		logDate: string,
		mood: string,
		reflections: ReflectionsType[]
	) => boolean;
	handleGoBack: () => void;
	setDisplayedFavoriteLogDates: React.Dispatch<React.SetStateAction<string[]>>;
}

const moodNames = {
	Rainbow: 'Proud',
	Sunny: 'Confident',
	Cloudy: 'Uncertain',
	Rainy: 'Disappointed',
	Stormy: 'Stressed',
};

const FavoriteLogs: React.FC<FavoriteLogsProps> = ({
	favoriteLogs,
	handleLogClick,
	mobile,
	setMonth,
	selectedDate,
	month,
	handleDateChange,
	onFavoriteToggle,
	handleGoBack,
	setDisplayedFavoriteLogDates,
}) => {
	const { user } = useAuth();
	const [favoriteLogDates, setFavoriteLogDates] = useState<string[]>([]);
	const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
	const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
	const [selectedFilters, setSelectedFilters] = useState({
		Rainbow: false,
		Sunny: false,
		Cloudy: false,
		Rainy: false,
		Stormy: false,
	});
	const router = useRouter();

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
	useEffect(() => {
		const selectedMonth = new Date(selectedDate as Date).getMonth();

		// Extract the selected moods
		const activeFilters = Object.keys(selectedFilters).filter(
			(mood) => selectedFilters[mood as keyof typeof selectedFilters]
		);

		const filteredDates = Object.keys(favoriteLogs).filter((date) => {
			const dateParts = date.split('-').map((part) => parseInt(part, 10));
			const logDate = new Date(
				dateParts[0],
				dateParts[1] - 1,
				dateParts[2],
				0,
				0,
				0
			);

			const log = favoriteLogs[date];
			return (
				log.favorite &&
				logDate.getMonth() === selectedMonth &&
				(activeFilters.length === 0 || activeFilters.includes(log.mood))
			);
		});
		setFavoriteLogDates(filteredDates);
		setDisplayedFavoriteLogDates(filteredDates); // Update the displayed favorite log dates
	}, [
		favoriteLogs,
		selectedDate,
		selectedFilters,
		setDisplayedFavoriteLogDates,
	]);

	const favoriteLog = async (
		logDate: string,
		mood: string,
		reflections: ReflectionsType[]
	) => {
		onFavoriteToggle(logDate, mood, reflections);
		handleGoBack();

		if (user) {
			await updateFavorite(user.uid, logDate, false);
		}
	};

	const handleCheckboxChange = (filter: string) => {
		setSelectedFilters((prevState) => ({
			...prevState,
			[filter]: !prevState[filter as keyof typeof selectedFilters],
		}));
	};

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
						<FilterDropdown
							handleCheckboxChange={handleCheckboxChange}
							selectedFilters={selectedFilters}
							mobile={mobile}
						/>
					</div>
				</div>
				<div className=' h-[0.125rem] bg-[#dee9f5]'></div>
			</div>
			<div className='flex flex-row flex-wrap gap-10'>
				{favoriteLogDates.length > 0 ? (
					[...favoriteLogDates]
						.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
						.map((date) => {
							const log = favoriteLogs[date];
							if (!log) {
								return null;
							}
							return (
								<div
									key={date}
									className='group relative flex w-36 cursor-pointer flex-col items-center justify-normal rounded-lg border border-[#DEE9F5]  hover:border-blue-400 '
									onClick={() => {
										const dateParts = date
											.split('-')
											.map((part) => parseInt(part, 10));
										const logDate = new Date(
											dateParts[0],
											dateParts[1] - 1,
											dateParts[2]
										);
										handleLogClick(
											{
												date: logDate,
												mood: log.mood,
												icon: `/moods/${log.mood.toLowerCase()}.svg`,
												reflections: log.reflections,
												favorite: log.favorite,
											},
											true
										); // Pass fromFavorites as true for Favorites
									}}
								>
									<button
										onClick={(event) => {
											event.stopPropagation();
											favoriteLog(date, log.mood, log.reflections);
										}}
										className={`absolute right-2 top-2 ${mobile ? 'h-4 w-4' : ''}`}
									>
										{log.favorite ? (
											<Heart
												size={mobile ? 12 : 24}
												weight='fill'
												color='red'
											/>
										) : (
											<Heart size={mobile ? 12 : 24} weight='bold' />
										)}
									</button>
									<div className='w-full px-3'>
										<Image
											src={`/moods/${log.mood.toLowerCase()}.svg`}
											alt='Mood'
											width={200}
											height={200}
											className='w-full'
										/>
									</div>

									<div className='w-full border-t border-[#DEE9F5] bg-[#FAFCFF] px-2 py-1 group-hover:border-[#2D81E0] group-hover:bg-[#E0F1FF]'>
										<p className='w-full text-end text-base font-medium text-black'>
											{new Date(date).toLocaleString('default', {
												month: 'short',
												timeZone: 'UTC',
											})}{' '}
											{new Date(date).getUTCDate()}
										</p>
										<div className='mt-1 w-full text-end'>
											<p className='text-xs text-gray-500'>
												{log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
												<span className='floating-period'>.</span>{' '}
												{moodNames[log.mood as keyof typeof moodNames]}
											</p>
										</div>
									</div>
								</div>
							);
						})
				) : (
					<p>No logs have been favorited yet.</p>
				)}
			</div>
		</div>
	);
};

export default FavoriteLogs;
