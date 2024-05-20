import React from 'react';
import Image from 'next/image'; // replace with actual import
import { CaretRight } from '@phosphor-icons/react'; // replace with actual import
import FilterDropdown from './filterDropdown'; // replace with actual import
import CustomPagination from './customPagination'; // replace with actual import

interface LogSummaryListProps {
	currentMoods: any[]; // replace with actual type
	handleCheckboxChange: (filter: string) => void;
	selectedFilters: any; // replace with actual type
	moodNames: any; // replace with actual type
	handlePagination: any; // replace with actual type
	filteredMoods: any; // replace with actual type
	pageSize: number;
	onToggle: any; // replace with actual type
	isRightBarOpen: boolean;
}

const LogSummaryList: React.FC<LogSummaryListProps> = ({
	currentMoods,
	handleCheckboxChange,
	selectedFilters,
	moodNames,
	handlePagination,
	filteredMoods,
	pageSize,
	onToggle,
	isRightBarOpen,
}) => {
	return (
		<>
			<div className='flex max-h-24 flex-col gap-5 pb-4'>
				<div className='flex w-full flex-row items-center justify-between  text-base font-semibold'>
					<span className='flex min-h-12 w-fit items-center justify-center py-1 text-base'>
						Summary Page
					</span>
					<FilterDropdown
						handleCheckboxChange={handleCheckboxChange}
						selectedFilters={selectedFilters}
					/>
				</div>
				{/* Divider */}
				<div className='h-[0.125rem] bg-[#dee9f5]'></div>
			</div>
			<div className='flex h-full flex-col gap-3 overflow-scroll'>
				{currentMoods.length > 0 ? (
					currentMoods.map(([date, mood], index) => {
						const dateObj = new Date(`${date}T00:00:00Z`);
						const day = dateObj.getUTCDate();
						const month = dateObj.toLocaleString('default', {
							month: 'short',
							timeZone: 'UTC',
						});
						// console.log(mood);
						return (
							<div
								key={date}
								className='flex h-20 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-blue-100 bg-boxBackground px-4  text-textPrimary hover:bg-hoverColor'
							>
								<div className='justify-content flex flex-col items-center'>
									<p className='text-base font-medium text-gray-600'>{day}</p>
									<p className='text-xs text-gray-600'>{month}</p>
								</div>

								<div className='h-10 border border-r border-blue-100 group-hover:border-white'></div>
								<div className='w-20'>
									<Image
										src={`/moods/${mood.toLowerCase()}.svg`}
										alt='Mood'
										width={200}
										height={200}
										className='w-full'
									/>
								</div>
								<div className='w-20'>
									<p className='text-sm font-medium text-black'>
										{mood.charAt(0).toUpperCase() + mood.slice(1)}
									</p>
									<p className='text-xs text-gray-500'>{moodNames[mood]}</p>
								</div>
								<CaretRight
									className='text-black group-hover:text-blue-500'
									size={16}
									weight='bold'
								/>
							</div>
						);
					})
				) : (
					<div className='flex w-full flex-col items-center justify-center'>
						<p className='text-base font-medium text-black'>No summaries yet</p>
						<Image
							src='/moods/greyWithFace.svg'
							alt='Empty'
							width={200}
							height={200}
							className='w-full'
						/>
						<p className='text-base font-medium text-gray-500'>
							Add a log to get started!
						</p>
					</div>
				)}
			</div>
		</>
	);
};

export default LogSummaryList;
