'use client';
import Link from 'next/link';
import React from 'react';
import {
	CloudSun,
	CalendarBlank,
	Info,
	Plus,
	Heart,
	Target,
	ChartBar,
	Chats,
} from '@phosphor-icons/react';
import { Button } from '@/stories/Button';
// import Image from 'next/image';

type Props = {
	setSelectedMenuItem: (menuItem: string) => void;
	selectedMenuItem: string;
	handleAddLogClick: () => void;
};

const Leftbar = ({
	setSelectedMenuItem,
	selectedMenuItem,
	handleAddLogClick,
}: Props) => {
	return (
		<div className='flex h-full w-full flex-col gap-4 bg-[#FAFCFF] px-6 py-2'>
			{/* <div className='relative h-[1.895rem] w-[2.385rem]'>
				<Image src='/logoUn.svg' alt='Uncloud Logo' layout='fill' />
			</div>
			<div className='relative h-[1.25rem] w-[3.781rem]'>
				<Image src='/logoCloud.svg' alt='Uncloud Logo' layout='fill' />
			</div> */}
			<div className='flex h-16 flex-row items-center justify-start gap-2'>
				<Link href='/'>
					<CloudSun className='h-8 w-8' />
				</Link>
				<Link href='/'>
					<span className='text-2xl font-semibold'>Uncloud</span>
				</Link>
			</div>

			{/* Calendar */}
			<div className='flex h-[15rem] w-full rounded-lg border border-[#D9D9D9] bg-white'></div>
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
							Add a Log
						</div>
					</span>
				}
				primary
				onClick={handleAddLogClick}
				version='primary'
			/>
			<div className=' mb-[0.5rem] mt-[0.1rem] h-[0.0625rem] bg-[#dee9f5]'></div>
			{/* Menu */}
			<div className='text-sm font-semibold text-[#706F6F]'>
				{/* Calendar Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'Calendar' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('Calendar')}
				>
					<CalendarBlank size={24} />
					<span className='leading-6'>Calendar</span>
				</div>
				{/* Goal Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'Goals' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('Goals')}
				>
					<Target size={24} />
					<span className='leading-6'>Goals</span>
				</div>
				{/* Trends Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'Trends' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('Trends')}
				>
					<ChartBar size={24} />
					<span className='leading-6'>Trends</span>
				</div>
				{/* Favorites Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'Favorites' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('Favorites')}
				>
					<Heart size={24} />
					<span className='leading-6'>Favorites</span>
				</div>
				{/* FAQ Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch rounded-lg px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'FAQ' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('FAQ')}
				>
					<Chats size={24} />
					<span className='leading-6'>FAQ</span>
				</div>
			</div>
		</div>
	);
};

export default Leftbar;
