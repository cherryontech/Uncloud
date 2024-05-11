import React from 'react';

import { Button } from './Button';
import { Icon } from './Icons';
import './header.css';

type User = {
	name: string;
};

interface HeaderProps {
	user?: User;
	onLogin?: () => void;
	onLogout?: () => void;
	onCreateAccount?: () => void;
}

export const Header = ({
	user,
	onLogin,
	onLogout,
	onCreateAccount,
}: HeaderProps) => (
	<header>
		<div className='header'>
			<div className='flex flex-row'>
				<Icon
					type='cloud-sun'
					size='32'
					weight='regular'
					color='var(--color-primary)'
				/>
				<h1>Uncloud</h1>
			</div>

			{user ? (
				<div className='flex flex-col items-center justify-end'>
					<>
						<span className='welcome'>
							Welcome, <b>{user.name}</b>!
						</span>
						<Button size='small' onClick={onLogout} label='Log out' />
					</>
				</div>
			) : (
				<div className='flex w-48 flex-row items-center justify-end'>
					<>
						<Button size='small' onClick={onLogin} label='Log in' />
						<Button
							primary
							size='small'
							onClick={onCreateAccount}
							label='Sign up'
							version='primary'
						/>
					</>
				</div>
			)}
		</div>
	</header>
);
