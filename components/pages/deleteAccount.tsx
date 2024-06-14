'use client';
import firebase from 'firebase/compat/app';
import React, { useState } from 'react';
import DeleteAccountConfirmatiom from '../DeleteAccountConfirm';
import { auth } from '@/app/firebase';
import {
	AuthCredential,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from 'firebase/auth';
const DeleteAccountButton: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleConfirmDeletion = async (password: string) => {
		const recentUser = auth.currentUser;
		if (!recentUser) throw new Error('No authenticated user found');
		if (!password) throw new Error('No password provided');
		const credential: AuthCredential = EmailAuthProvider.credential(
			recentUser?.email || '',
			password
		);
		await reauthenticateWithCredential(recentUser, credential);
		recentUser
			.delete()
			.then(() => {
				console.log('User account deleted successfully.');
				handleCloseModal();
			})
			.catch((error) => {
				console.error('Error deleting user account: ', error);
			});
	};

	return (
		<div>
			<div className='w-full space-y-8 md:w-[40rem]'>
				<p className='mt-10 text-lg font-bold'>Delete Account</p>
				<div className='w-full'>
					<p className='text-sm'>
						We will permanently delete your Uncloud account and all associated
						entries. Please be sure that you want to delete everything on your
						account before proceeding.
					</p>
					<p className='text-sm font-bold'>
						We will not be able to recover your entries after you delete your
						account!
					</p>
				</div>
				<button className='font-bold text-[#D40C0C]' onClick={handleOpenModal}>
					I want to delete my account
				</button>
			</div>
			<DeleteAccountConfirmatiom
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onConfirm={handleConfirmDeletion}
			/>
		</div>
	);
};

export default DeleteAccountButton;
