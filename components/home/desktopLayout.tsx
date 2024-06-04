// DesktopLayout.tsx
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

interface DesktopLayoutProps {
	value: Value;
	setSelectedMenuItem: (item: any) => void; // replace `any` with the actual type
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
	rightBarContent: React.ReactNode;
	isPopupOpen: boolean;
	isLoading: boolean;
	mobile: boolean;
}

export default function DesktopLayout({
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
	rightBarContent,
	isPopupOpen,
	isLoading,
	mobile,
}: DesktopLayoutProps) {
	console.log(selectedMenuItem);
	return (
		<div className='grid-container'>
			{isLoading && <LoadingSpinner />}
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
					mobile={false}
				/>
			</div>
			<div className={`main-container bg-[#F3F5F9]`}>
				<div className='top-bar flex flex-row'>
					<div className='col-span-1 flex w-full flex-row items-center justify-start'>
						<span className='text-3xl font-semibold'>My Log</span>
					</div>

					<Userbar mobile={false} />
				</div>

				<div
					className={`content ${
						isRightBarOpen &&
						(selectedMenuItem === 'Calendar' ||
							selectedMenuItem === 'Favorites')
							? 'right-bar-open'
							: 'right-bar-collapsed'
					}`}
				>
					<div className='main-content flex flex-col items-center  bg-[#F3F5F9]'>
						<div
							className={`h-full w-full rounded-2xl border   ${selectedMenuItem === 'Calendar' ? 'border-[#DEE9F5] bg-white' : ''}  px-4 py-6`}
						>
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
							// mobile={mobile}
						>
							{rightBarContent}
						</Rightbar>
					)}
				</div>
			</div>
		</div>
	);
}
