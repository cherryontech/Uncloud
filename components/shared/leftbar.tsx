import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
	Plus,
	List,
	CalendarBlank,
	ChartBar,
	Heart,
	UserCircle,
	Gear,
	Chats,
	Target,
} from '@phosphor-icons/react';
import { Button } from '@/stories/Button';
import Image from 'next/image';
import Userbar from '@/components/shared/userbar';
import '/app/styles/dropDown.css';

type Props = {
	setSelectedMenuItem: (menuItem: string) => void;
	selectedMenuItem: string;
	handleAddLogClick: () => void;
	MiniCalendar?: React.ReactNode;
	mobile: boolean;
};

const Leftbar = ({
	setSelectedMenuItem,
	selectedMenuItem,
	handleAddLogClick,
	MiniCalendar,
	mobile,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const hamburgerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				hamburgerRef.current !== event.target
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			{mobile ? (
				<>
					<div className='hamburger-menu mobile-dropdown'>
						<List
							size={18}
							color='#2C2C2C'
							onClick={() => setIsOpen(!isOpen)}
							ref={hamburgerRef}
						/>

						{isOpen && (
							<div
								ref={dropdownRef}
								className='menu-items mobile-dropdown-content-navbar flex w-56 flex-col rounded-md bg-[#F3F5F9] px-2 py-2'
							>
								<div
									className={`flex min-h-[3rem] w-full flex-row items-center gap-3  px-3 py-4 hover:bg-[#DEE3E6]`}
									onClick={() => {
										setSelectedMenuItem('Calendar');
										setIsOpen(false);
									}}
								>
									<CalendarBlank size={12} />
									<span className=''>Calendar</span>
								</div>

								<div
									className={`flex min-h-[3rem] w-full flex-row items-center gap-3  px-3 py-4 hover:bg-[#DEE3E6]`}
									onClick={() => {
										setSelectedMenuItem('Trends');
										setIsOpen(false);
									}}
								>
									<ChartBar size={12} />
									<span className=''>Trends</span>
								</div>

								<div
									className={`flex min-h-[3rem] w-full flex-row items-center gap-3  px-3 py-4 hover:bg-[#DEE3E6]`}
									onClick={() => {
										setSelectedMenuItem('Favorites');
										setIsOpen(false);
									}}
								>
									<Heart size={12} />
									<span className=''>Favorites</span>
								</div>

								<div
									className={`hover:bg-[#DEE3E6]Don' flex min-h-[3rem] w-full flex-row items-center  gap-3 px-3 py-4 `}
									onClick={() => {
										setSelectedMenuItem('Profile');
										setIsOpen(false);
									}}
								>
									<UserCircle size={12} />
									<span className=''>Profile</span>
								</div>
							</div>
						)}
					</div>
					<Userbar setSelectedMenuItem={setSelectedMenuItem} mobile={mobile} />
				</>
			) : (
				<>
					<div className='flex h-full w-full flex-col gap-4 bg-[#FAFCFF] px-6 py-2'>
						<div className='flex h-16  items-center justify-center'>
							<Link href='/'>
								<Image
									src='Uncloud_Logo_2.svg'
									alt='Uncloud Logo'
									width={123}
									height={58}
								/>
							</Link>
						</div>

						{selectedMenuItem === 'Settings' ||
						selectedMenuItem === 'Profile' ? (
							<div className='text-sm font-semibold text-[#706F6F] '>
								<div
									className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0]  ${selectedMenuItem === 'Profile' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
									onClick={() => setSelectedMenuItem('Profile')}
								>
									<UserCircle size={24} />

									<span className='leading-6'>My Profile</span>
								</div>
								<div
									className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0]  ${selectedMenuItem === 'Settings' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
									onClick={() => setSelectedMenuItem('Settings')}
								>
									<Gear size={24} />
									<span className='leading-6'>Settings</span>
								</div>
							</div>
						) : (
							<>
						{/* Calendar */}
						{MiniCalendar}
						<div data-tooltip-id='addLogTooltip'>
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
										<div
											className='flex content-center items-center justify-center'
											// data-tooltip-id='addLogTooltip'
											// data-tooltip-content='Get started with your first log by clicking "Add a Log"!'
										>
											Add a Log
										</div>
									</span>
								}
								primary
								onClick={handleAddLogClick}
								version='primary'
							/>
						</div>
						<div className=' mb-[0.5rem] mt-[0.1rem] h-[0.0625rem] bg-[#dee9f5]'></div>
						{/* Menu */}
						<div className='text-sm font-semibold text-[#706F6F] '>
							{/* Calendar Link */}
							<div
								className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0]  ${selectedMenuItem === 'Calendar' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
								onClick={() => setSelectedMenuItem('Calendar')}
							>
								<CalendarBlank size={24} />
								<span className='leading-6'>Calendar</span>
							</div>

							{/* Goal Link */}
							{/* <div
								className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0]  ${selectedMenuItem === 'Goals' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
								onClick={() => setSelectedMenuItem('Goals')}
							>
								<Target size={24} />
								<span className='leading-6'>Goals</span>
							</div> */}
							{/* Trends Link */}
							<div
								className={`flex h-[3.5rem] cursor-pointer  items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0]  ${selectedMenuItem === 'Trends' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
								onClick={() => setSelectedMenuItem('Trends')}
							>
								<ChartBar size={24} />
								<span className='leading-6'>Trends</span>
							</div>
							{/* Favorites Link */}
							<div
								className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0] ${selectedMenuItem === 'Favorites' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
								onClick={() => setSelectedMenuItem('Favorites')}
							>
								<Heart size={24} />
								<span className='leading-6'>Favorites</span>
							</div>
							{selectedMenuItem === 'Settings' ||
							selectedMenuItem === 'Profile' ? null : (
								<div
									className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0] ${selectedMenuItem === 'Profile' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
									onClick={() => setSelectedMenuItem('Profile')}
								>
									<UserCircle size={24} />
									<span className='leading-6'>Profile</span>
								</div>
							)}
							{/* FAQ Link */}
							{/* <div
								className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:text-[#2D81E0]  ${selectedMenuItem === 'FAQ' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
								onClick={() => setSelectedMenuItem('FAQ')}
							>
								<Chats size={24} />
								<span className='leading-6'>FAQ</span>
							</div> */}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Leftbar;
