import React, { ChangeEvent } from 'react';
import './customInput.css';

interface CustomInputProps {
	name: string;
	value: string;
	placeholder: string;
	label: string;
	type: string;
	error?: string;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
	name,
	value,
	placeholder,
	label,
	type,
	handleChange,
	error,
}) => {
	return (
		<div className='my-3 w-full space-y-1.5'>
			<label className='text-sm font-bold' htmlFor={name}>
				{label}
			</label>
			<input
				type={type}
				placeholder={placeholder}
				name={name}
				id={name}
				value={value || ''}
				onChange={handleChange}
				className='block w-full rounded-md border border-[#D9D9D9] bg-transparent p-2 py-2 pl-3 pr-10 text-base font-medium hover:border-[#706f6f] focus:border-[#706f6f] focus:outline-0 focus:outline-[#706f6f] focus:ring focus:ring-[#D9D9D9]'
			/>
			{error && <p className='text-sm text-red-600'>{error}</p>}
		</div>
	);
};

export default CustomInput;
