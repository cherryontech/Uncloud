'use client';
import { useAuth } from '@/app/context/UserProvider';
import { auth } from '@/app/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import React from 'react';
import { CloudSun } from '@phosphor-icons/react';
import { Heading } from '@/stories/Heading';

type Props = {};

const Navbar = (props: Props) => {
	const handleLogOut = () => {
		signOut(auth)
			.then(() => {
				console.log('logged out');
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const { user } = useAuth();
	return (
		<div className='flex w-full items-center justify-between px-12 py-2'>
			{/* Add SunCloud icon as a link */}
			<div className='flex flex-row items-center justify-start gap-2'>
				<Link href='/'>
					<CloudSun className='h-8 w-8' />
				</Link>
				<Link href='/'>
					<Heading label='Uncloud' type='h5' />
				</Link>
			</div>
			<div className='flex items-center justify-center gap-5'>
				<>
					{user ? (
						<div onClick={handleLogOut}>Logout</div>
					) : (
						<>
							<Link href={'/auth/login'}>Login</Link>
							<Link href={'/auth/signUp'}>Sign Up</Link>{' '}
						</>
					)}
				</>
			</div>
		</div>
	);
};

export default Navbar;
