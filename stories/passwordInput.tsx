import React, { useState, ChangeEvent } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
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
		<div className='w-full space-y-1.5'>
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
					className={[
						error ? 'border-red-500' : 'border-[#D9D9D9]',
						error ? 'focus:ring-0' : 'focus:ring-[#D9D9D9]',
						error ? 'focus:outline-red-500' : 'focus:outline-[#706f6f]',
						error ? 'focus:border-red-500' : 'focus:border-[#706f6f]',
						'block',
						'w-full',
						'rounded-md',
						'border',
						'border-[#D9D9D9]',
						'bg-transparent',
						'p-2',
						'pl-3',
						'pr-10',
						'text-base',
						'font-medium',
						'hover:border-[#706f6f]',
						'focus:border-[#706f6f]',
						'focus:outline-0',
						'focus:outline-[#706f6f]',
						'focus:ring',
						'focus:ring-[#D9D9D9]',
					].join(' ')}
					// className='block w-full rounded-md border border-[#D9D9D9] bg-transparent p-2 py-2 pl-3 pr-10 text-base font-medium hover:border-[#706f6f] focus:border-[#706f6f] focus:outline-0 focus:outline-[#706f6f] focus:ring focus:ring-[#D9D9D9]'
				/>

				<div
					aria-label={
						PasswordInput ? 'Password Visible' : 'Password Invisible.'
					}
					className='text-black'
					onClick={() => {
						setPasswordInput((prev) => !prev);
					}}
				>
					{PasswordInput ? (
						<Eye
							className='absolute right-2 top-2 h-6 w-6 cursor-pointer select-none'
							color='#d9d9d9'
							size='1rem'
						/>
					) : (
						<EyeSlash
							className='absolute right-2 top-2 h-6 w-6 cursor-pointer select-none'
							color='#d9d9d9'
							size='1rem'
						/>
					)}
				</div>
			</div>
			{error && <p className='text-sm font-semibold text-red-600'>{error}</p>}
		</div>
	);
};
export default PasswordInput;
