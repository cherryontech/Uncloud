'use client';
import Link from 'next/link';
import React from 'react';
import { CloudSun, CalendarBlank, Info } from '@phosphor-icons/react';
// import Image from 'next/image';

type Props = {
	setSelectedMenuItem: (menuItem: string) => void;
	selectedMenuItem: string;
};

const Leftbar = ({ setSelectedMenuItem, selectedMenuItem }: Props) => {
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

			{/* Menu */}
			<div>
				{/* Calendar Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'Calendar' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('Calendar')}
				>
					<CalendarBlank size={32} />
					<span className='font-semibold leading-6'>Calendar</span>
				</div>
				{/* About Link */}
				<div
					className={`flex h-[3.5rem] cursor-pointer items-center gap-4 self-stretch px-3 py-2 hover:bg-[#DEE3E6] ${selectedMenuItem === 'About' ? 'rounded-lg bg-[#EFF7FE] text-primary' : ''}`}
					onClick={() => setSelectedMenuItem('About')}
				>
					<Info size={32} />
					<span className='font-semibold leading-6'>About</span>
				</div>
			</div>
		</div>
	);
};

export default Leftbar;
