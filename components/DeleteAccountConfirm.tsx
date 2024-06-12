import CustomInput from '@/stories/customInput';
import Image from 'next/image';
import React, { useState } from 'react';

interface props {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (password: string) => void;
}

const DeleteAccountConfirmatiom: React.FC<props> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	const [password, setPassword] = useState('');

	const handleConfirm = () => {
		onConfirm(password);
		setPassword(''); 
	};
	if (!isOpen) return null;
	return (
		<div className='fixed bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center bg-black/50'>
			<div className=' flex flex-col rounded-2xl items-center justify-center text-center max-w-[400px] space-y-2 border-black bg-white p-8 px-12'>
				<Image src='/delete.svg' alt='logo' width={60} height={60} />
				<p>Please enter your password to confirm :</p>

				<CustomInput
					name={'password'}
					type='password'
					value={password}
					handleChange={(e) => setPassword(e.target.value)}
					placeholder='Password'
				/>
				<p>Are you sure you want to delete your account?</p>
				<button
					className='button--primary w-fit !cursor-pointer rounded-full px-6 py-[0.625rem] text-sm !font-bold leading-6 text-white'
					onClick={onClose}
				>
					No, I've changed my mind
				</button>
				<button
					className='bg-white text-[#D40C0C] w-fit cursor-pointer rounded-full px-6 py-[0.625rem] text-sm !font-bold leading-6 hover:bg-gray-200'
					onClick={handleConfirm}
				>
					Yes, delete
				</button>
			</div>
		</div>
	);
};

export default DeleteAccountConfirmatiom;
