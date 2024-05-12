'use client';
import { useAuth } from '@/app/context/UserProvider';
import { auth } from '@/app/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import React from 'react';
import { CloudSun } from '@phosphor-icons/react';
import { Heading } from '@/stories/Heading';

type Props = {};

const Navbar = (props: Props) => {
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
		<div className='flex w-full items-center justify-between px-12 py-2'>
			<div className='flex flex-row items-center justify-start gap-2'>
				<Link href='/'>
					<CloudSun className='h-8 w-8' />
				</Link>
				<Link href='/'>
					<Heading label='Uncloud' type='h5' />
				</Link>
			</div>
			<div className='flex items-center justify-center gap-5'>
				{user ? (
					// Change the onClick event to just a normal Link component
					<Link href='#' onClick={handleLogOut}>
						Logout
					</Link>
				) : (
					<>
						<Link href={'/auth/login'}>Login</Link>
						<Link href={'/auth/signUp'}>Sign Up</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Navbar;
