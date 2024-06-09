'use client';
import { useAuth } from '@/app/context/UserProvider';
import { auth } from '@/app/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/stories/Button';

type Props = {};

const Navbar = (props: Props) => {
	const router = useRouter();

	const handleLogOut = () => {
		signOut(auth)
			.then(() => {
				console.log('logged out');
				router.push('/auth/confirmLogout');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const { user } = useAuth();

	if (!user) {
		return (
			<div className='fixed left-0 top-0 z-10 flex h-[4.6875rem] w-full items-center justify-between bg-white px-[6.25rem] shadow-[0_14px_24px_0_rgba(0,0,0,0.01)] backdrop-blur-md'>
				<div className='flex flex-row items-center justify-start gap-2'>
					<Link href='/'>
						<div className='relative h-[3.63rem] w-[7.66rem]'>
							<Image
								src='/Uncloud_Logo_2.svg'
								alt='Uncloud Logo'
								layout='fill'
							/>
						</div>
					</Link>
				</div>
				<div className='flex items-center justify-center gap-6'>
					<a
						className='w-fit flex-shrink-0 text-base font-medium leading-[1.5625rem] text-[#040b2e]'
						href={'/auth/login'}
					>
						Log in
					</a>
					<Button
						primary={true}
						onClick={() => router.push('/auth/signUp')}
						label='Get started'
					/>
				</div>
			</div>
		);
	}

	return null;
};

export default Navbar;
