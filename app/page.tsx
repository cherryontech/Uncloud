'use client';
import React, { useEffect, useState } from 'react';
import { updateUser, getUser } from '@/components/utils/serverFunctions';
import { ConfirmationMessage } from '@/stories/Confirmation';
import { useAuth } from './context/UserProvider';
import MainComponent from './mainComponent';
import Landing from './landing';

const Home: React.FC = () => {
	const { user } = useAuth();
	const [displayConfirmationMessage, setDisplayConfirmationMessage] =
		useState<boolean>(false);
	const [isConfirmationClosed, setIsConfirmationClosed] =
		useState<boolean>(false);

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData: any) => {
				setDisplayConfirmationMessage(!userData.closedConfirmationMessage);
			});
		}
	}, [user]);

	const hideConfirmationMessage = async (): Promise<void> => {
		setDisplayConfirmationMessage(false);
		setIsConfirmationClosed(true); // Update the state here
		if (user) {
			await updateUser(user.uid, { closedConfirmationMessage: true });
		}
	};

	return (
		<>
			{user ? (
				<>
					{displayConfirmationMessage && (
						<ConfirmationMessage
							userDisplayName={user.displayName || ''}
							hideConfirmationMessage={hideConfirmationMessage}
						/>
					)}
					<MainComponent isConfirmationClosed={isConfirmationClosed} />
				</>
			) : (
				<div>
					<Landing />
				</div>
			)}
		</>
	);
};

export default Home;
