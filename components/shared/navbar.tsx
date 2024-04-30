'use client';
import { useAuth } from '@/app/context/UserProvider';
import { auth } from '@/app/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import React from 'react';

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
		<div className='flex w-full items-center justify-between px-16 py-5'>
			<p>LOGO</p>
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
