import React, { useState } from 'react';
import { CaretDown, CaretUp, SignOut, User, Gear } from '@phosphor-icons/react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase';
import Avatar from './avatar';

import '/app/styles/dropDown.css';

type User = {
	displayName: string | null;
	email: string | null;
};

type DropdownProps = {
	user: User;
};

export default function Dropdown({ user }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
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

	const menu = {
		Account: { url: '#', icon: <User size={24} /> },
		Settings: { url: '#', icon: <Gear size={24} /> },
	};
	return (
		<div className='dropdown w-full'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`dropdown-button flex w-fit flex-row items-center justify-evenly gap-4 bg-[#F3F5F9] py-2 ${isOpen ? '' : ''}`}
			>
				<Avatar />
				<div className='flex flex-col items-start justify-center'>
					<span className='text-lg font-semibold'>{user.displayName}</span>
					<span className='text-sm font-normal text-[#706F6F]'>
						{user.email}
					</span>
				</div>
				{isOpen ? <CaretUp size={24} /> : <CaretDown size={24} />}
			</button>

			{isOpen && (
				<div className='dropdown-content flex w-full flex-col rounded-md bg-[#F3F5F9] py-2'>
					{/* Add links */}
					{Object.entries(menu).map(([text, { url, icon }]) => (
						<a href={url} key={text}>
							<div className='flex h-[3.5rem] items-center gap-3 self-stretch px-3 py-2 hover:bg-[#DEE3E6]'>
								{icon}
								<span>{text}</span>
							</div>
						</a>
					))}

					<div className='flex h-[1px] w-full items-center border-b border-[#c0c8cc] '></div>
					<a href='#' onClick={handleLogOut}>
						<div className='flex h-[3.5rem] items-center gap-3 self-stretch px-3 py-2 hover:bg-[#DEE3E6]'>
							<SignOut size={24} />
							<span>Logout</span>
						</div>
					</a>
				</div>
			)}
		</div>
	);
}
