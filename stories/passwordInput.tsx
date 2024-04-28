import React, { useState, ChangeEvent } from 'react';
import './customInput.css';

interface PasswordInputProps {
	name: string;
	value: string;
	placeholder: string;
	label: string;
	type: string;
	error?: string;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
	name,
	value,
	placeholder,
	label,
	type,
	handleChange,
	error,
}) => {
	const [PasswordInput, setPasswordInput] = useState(false);
	return (
		<div className='my-3 w-full space-y-1.5'>
			<label className='text-sm font-bold' htmlFor={name}>
				{label}
			</label>
			<div className='relative'>
				<input
					type={PasswordInput ? 'text' : 'password'}
					placeholder={placeholder}
					name={name}
					id={name}
					value={value || ''}
					onChange={handleChange}
					className='block w-full rounded-md border border-[#D9D9D9] bg-transparent p-2 py-2 pl-3 pr-10 text-base font-medium hover:border-[#706f6f] focus:border-[#706f6f] focus:outline-0 focus:outline-[#706f6f] focus:ring focus:ring-[#D9D9D9]'
				/>
				{error && <p className='text-sm text-red-600'>{error}</p>}

				<button
					type='button'
					aria-label={
						PasswordInput ? 'Password Visible' : 'Password Invisible.'
					}
					className='text-black'
					onClick={() => {
						setPasswordInput((prev) => !prev);
					}}
				>
					{PasswordInput ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='#d9d9d9'
							className='absolute right-2 top-2 h-6 w-6 cursor-pointer select-none'
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
							></path>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
							></path>
						</svg>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='#d9d9d9'
							className='absolute right-2 top-2 h-6 w-6 cursor-pointer select-none'
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
							></path>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
};
export default PasswordInput;
