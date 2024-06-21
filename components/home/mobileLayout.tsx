import React, { Dispatch, SetStateAction } from 'react';
import Leftbar from '@/components/shared/leftbar';
import Userbar from '@/components/shared/userbar';
import Rightbar from '@/components/shared/rightbar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import MiniCalendarView from '@/components/shared/miniCalendar';
import { UserProvider } from '@/app/context/UserProvider';
import { Value } from '@/components/home/calendar';
import { ReflectionsType } from '@/components/home/newLogPopup';
import { Win } from '@/components/home/moodPrompts';

interface MobileLayoutProps {
	value: Value;
	setSelectedMenuItem: (item: any) => void;
	selectedMenuItem: string;
	handleAddLogClick: () => void;
	month: number;
	setMonth: Dispatch<SetStateAction<number>>;
	selectedDate: Value;
	setValue: Dispatch<SetStateAction<Value>>;
	handleDateChange: (newValue: Value) => void;
	handleLogClick: (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
		favorite: boolean;
		wins?: Win[];
	}) => void;
	component: React.ReactNode;
	isRightBarOpen: boolean;
	handleRightBarToggle: (open: boolean) => void;
	currentPage: number;
	handlePagination: (value: { selected: number }) => void;
	isSummaryList: boolean;
	setIsSummaryList: Dispatch<SetStateAction<boolean>>;
	rightBarContent: React.ReactNode | null;
	setRightBarContent: Dispatch<SetStateAction<JSX.Element | null>>;
	isPopupOpen: boolean;
	isLoading: boolean;
	mobile: boolean;
	title: string;
	displayedFavoriteLogDates: string[];
}

export default function MobileLayout({
	setSelectedMenuItem,
	selectedMenuItem,
	handleAddLogClick,
	month,
	setMonth,
	selectedDate,
	value,
	setValue,
	handleDateChange,
	handleLogClick,
	component,
	isRightBarOpen,
	handleRightBarToggle,
	currentPage,
	handlePagination,
	isSummaryList,
	setIsSummaryList,
	rightBarContent,
	setRightBarContent,
	isPopupOpen,
	isLoading,
	mobile,
	title,
	displayedFavoriteLogDates,
}: MobileLayoutProps) {
	return (
		<div className='mobile-grid-container'>
			{isLoading && <LoadingSpinner />}
			<div className='mobile-navbar border-r-[0.0625rem] border-[#D9D9D9]'>
				<Leftbar
					setSelectedMenuItem={setSelectedMenuItem}
					selectedMenuItem={selectedMenuItem}
					handleAddLogClick={handleAddLogClick}
					mobile={true}
				/>
			</div>
			<div className={`mobile-main-container bg-[#F3F5F9]`}>
				<div className='mobile-top-bar flex flex-row'>
					<div className='col-span-1 flex h-16 w-full flex-row items-center justify-start'>
						<span className='text-3xl font-semibold text-[#2C2C2C]'>
							{title}
						</span>
					</div>
				</div>

				<div
					className={`mobile-content ${
						isRightBarOpen && selectedMenuItem === 'Calendar'
							? 'right-bar-open'
							: 'right-bar-collapsed'
					}`}
				>
					<div className='mobile-main-content flex flex-col items-center  bg-[#F3F5F9]'>
						<div className='h-full w-full overflow-auto rounded-2xl  border border-[#DEE9F5] bg-white px-4 py-6'>
							<UserProvider>{component}</UserProvider>
						</div>
					</div>
					{(selectedMenuItem === 'Calendar' ||
						selectedMenuItem === 'Favorites') && (
						<Rightbar
							key={mobile ? 'mobile' : 'desktop'}
							month={month}
							isRightBarOpen={isRightBarOpen}
							onToggle={handleRightBarToggle}
							handleLogClick={handleLogClick}
							selectedDate={selectedDate}
							value={value}
							isPopupOpen={isPopupOpen}
							setValue={setValue}
							handleDateChange={handleDateChange}
							currentPage={currentPage}
							handlePagination={handlePagination}
							isSummaryList={isSummaryList}
							setIsSummaryList={setIsSummaryList}
							selectedMenuItem={selectedMenuItem}
							rightBarContent={rightBarContent}
							setRightBarContent={setRightBarContent}
							displayedFavoriteLogDates={displayedFavoriteLogDates}
						>
							{rightBarContent}
						</Rightbar>
					)}
				</div>
			</div>
		</div>
	);
}
