import React, { useState, useEffect, useRef } from 'react';
import { CaretDown, CaretUp, SignOut, User, Gear } from '@phosphor-icons/react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase';
import Avatar from './avatar';

import '/app/styles/dropDown.css';

type User = {
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
};

type DropdownProps = {
	user: User;
	mobile: boolean;
	setSelectedMenuItem: (item: any) => void;
};

export default function Dropdown({
	user,
	mobile,
	setSelectedMenuItem,
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const dropdownRef = useRef<HTMLDivElement>(null);
	
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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const menu = mobile
		? {
				Profile: { url: '#', icon: <User size={10} />, color: '#2d81e0' },
				Settings: {
					url: '/settings',
					icon: <Gear size={10} />,
					color: '#2d81e0',
				},
			}
		: {
				Profile: { url: '#', icon: <User size={24} />, color: '#2d81e0' },
				Settings: {
					url: '/settings',
					icon: <Gear size={24} />,
					color: '#2d81e0',
				},
			};

	return (
		<>
			{mobile ? (
				<div className='dropdown w-full'>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className={`dropdown-button flex w-full flex-row items-center justify-end gap-2 bg-[#FAFCFF] py-2 pr-2 ${isOpen ? '' : ''}`}
					>
						<Avatar image={user.photoURL} />
						{isOpen ? (
							<CaretUp size={8} color='#2C2C2C' />
						) : (
							<CaretDown size={8} color='#2C2C2C' />
						)}
					</button>

					{isOpen && (
						<div
							ref={dropdownRef}
							className='mobile-dropdown-content dropdown-content flex w-56 flex-col rounded-md bg-[#F3F5F9] px-2 py-2'
						>
							<div className='flex flex-col items-start justify-center px-3 py-2'>
								<span className='text-lg font-semibold'>
									{user.displayName}
								</span>
								<span className='text-xs font-normal text-[#706F6F]'>
									{user.email}
								</span>
							</div>
							<div className='class="dropdown-button " flex w-full flex-row items-center justify-end gap-6 bg-[#F3F5F9] py-2 pr-2'></div>
							{/* Add links */}
							<div className=' dropdown-content flex w-full flex-col rounded-md bg-[#F3F5F9] py-2 '>
								{Object.entries(menu).map(([text, { url, icon }]) => (
									<div
										key={text}
										onClick={() => {
											setIsOpen(false);

											setSelectedMenuItem(text);
										}}
										className='flex min-h-[3rem] w-full flex-row items-center gap-3  px-3 py-1 hover:bg-[#DEE3E6]'
									>
										<div className='h-full'>{icon}</div>
										<span className='h-full'>{text}</span>
									</div>
								))}
							</div>

							<div className='flex h-[1px] w-full items-center border-b border-[#c0c8cc] '></div>
							<a href='#' onClick={handleLogOut}>
								<div className='flex min-h-[3rem] cursor-pointer items-center gap-3 self-stretch px-3 py-1 text-base hover:bg-[#DEE3E6]'>
									<SignOut size={10} />
									<span>Logout</span>
								</div>
							</a>
						</div>
					)}
				</div>
			) : (
				<div className='dropdown w-full'>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className={`dropdown-button flex w-full flex-row items-center justify-end gap-6 bg-[#F3F5F9] py-2 pr-2 ${isOpen ? '' : ''}`}
					>
						<Avatar image={user.photoURL} />
						<div className='flex flex-col items-start justify-center'>
							<span className='text-lg font-semibold'>{user.displayName}</span>
							<span className='text-sm font-normal text-[#706F6F]'>
								{user.email}
							</span>
						</div>
						{isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
					</button>

					{isOpen && (
						<div
							ref={dropdownRef}
							className='dropdown-content flex w-full flex-col rounded-md bg-[#F3F5F9] py-2'
						>
							{/* Add links */}
							{Object.entries(menu).map(([text, { url, icon }]) => (
								<div
									key={text}
									onClick={() => {
										setIsOpen(false);
										setSelectedMenuItem(text);
									}}
								>
									<div className='flex h-[3.5rem] items-center gap-3 self-stretch px-3 py-2 hover:bg-[#DEE3E6]'>
										{icon}
										<span>{text}</span>
									</div>
								</div>
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
			)}
		</>
	);
}
