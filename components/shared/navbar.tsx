'use client';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/app/auth/useAuth';
type Props = {};

const Navbar = (props: Props) => {
	const { user } = useAuth();
	return (
		<div className='flex w-full items-center justify-between px-16 py-5'>
			<p>LOGO</p>
			<div className='flex items-center justify-center gap-5'>
				<>
					{user ? (
						<div>Logout</div>
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
