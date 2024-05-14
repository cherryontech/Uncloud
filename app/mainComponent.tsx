'use client';
import { useAuth } from '@/app/context/UserProvider';
import { UserProvider } from './context/UserProvider';
import { useState } from 'react';

import About from '@/components/pages/about';
import CalendarView from '@/components/home/calendar';
import Userbar from '@/components/shared/userbar';
import Leftbar from '@/components/shared/leftbar';
import Rightbar from '@/components/shared/rightbar';

export default function MainComponent({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = useAuth();
	const [selectedMenuItem, setSelectedMenuItem] = useState('Calendar');

	let Component;
	switch (selectedMenuItem) {
		case 'Calendar':
			Component = CalendarView;
			break;
		case 'About':
			Component = About;
			break;
		default:
			Component = CalendarView;
	}
	return (
		<div className='grid-container'>
			<div className='sidebar'>
				<Leftbar
					setSelectedMenuItem={setSelectedMenuItem}
					selectedMenuItem={selectedMenuItem}
				/>{' '}
			</div>
			<div className='main-container bg-[#F3F5F9] py-2'>
				<div className='col-span-1 flex h-16 w-full flex-row items-center justify-start'>
					<span className='text-3xl font-semibold'>My Log</span>
				</div>
				<UserProvider>
					<Userbar />
				</UserProvider>
				<div className='main-content flex flex-col items-center  bg-[#F3F5F9] pb-6'>
					<div className='h-full w-full rounded-2xl bg-white p-6'>
						<UserProvider>
							<Component />
						</UserProvider>
					</div>
				</div>
				<div className='mainRightBar'>
					<Rightbar />
				</div>
			</div>
		</div>
	);
}
