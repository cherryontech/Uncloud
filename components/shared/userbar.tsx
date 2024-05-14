'use client';
import { useAuth } from '@/app/context/UserProvider';
import { auth } from '@/app/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import React from 'react';
import { CloudSun } from '@phosphor-icons/react';
import { Heading } from '@/stories/Heading';
import Dropdown from './dropDown';
import Avatar from './avatar';

type Props = {};

const Userbar = (props: Props) => {
	const router = useRouter(); // Use the useRouter hook

	const handleLogOut = () => {
		signOut(auth)
			.then(() => {
				console.log('logged out');
				router.push('/auth/confirmLogout'); // Redirect to confirmLogout page
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const { user } = useAuth();
	return (
		<div className='nav-container flex w-full items-center justify-between bg-[#F3F5F9] pr-6'>
			<div>
				{user && (
					<div className='flex flex-row items-center gap-4'>
						<Dropdown user={user} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Userbar;
