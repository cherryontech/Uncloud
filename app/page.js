'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { updateUser, getUser } from '@/components/utils/serverFunctions';
// import ConfirmationMessage from '@/components/ConfirmationMessage';
import { ConfirmationMessage } from '@/stories/Confirmation';
import { useAuth } from './context/UserProvider';
import AddNewLog from '@/components/home/addNewLog';
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
		await updateUser(user.uid);
	}

	return (
		<div className='px-12'>
			<h1>Home</h1>

			{user ? (
				<>
					{displayConfirmationMessage && (
						<ConfirmationMessage
							userDisplayName={user.displayName}
							hideConfirmationMessage={hideConfirmationMessage}
						/>
					)}

					<div>Hi, {user.displayName}</div>
					<AddNewLog/>
				</>
			) : (
				<div>no user authenticated</div>
			)}
		</div>
	);
}
