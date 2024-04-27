'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAuth } from './auth/useAuth';
import { UserProvider } from './context/UserProvider';
import { updateUser, getUser } from './api';
import ConfirmationMessage from '@/components/ConfirmationMessage';
export default function Home() {
	const { user } = useAuth();
	const [displayConfirmationMessage, setDisplayConfirmationMessage] =
		useState(false);

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData) => {
				setDisplayConfirmationMessage(!userData.closedConfirmationMessage);
			});
		}
	}, [user]);

	async function hideConfirmationMessage() {
		setDisplayConfirmationMessage(false);
		updateUser(user.uid);
	}

	return (
		<UserProvider>
			<div>
				<h1>Home</h1>

				{!!user ? (
					<>
						{displayConfirmationMessage && (
							<ConfirmationMessage
								userDisplayName={user.displayName}
								hideConfirmationMessage={hideConfirmationMessage}
							/>
						)}

						<div>Hi, {user.displayName}</div>
					</>
				) : (
					<div>no user authenticated</div>
				)}
			</div>
		</UserProvider>
	);
}
