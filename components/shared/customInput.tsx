import React, { ChangeEvent } from 'react';

interface CustomInputProps {
	name: string;
	value: string;
	placeholder: string;
	label?: string;
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
		<div className='my-3 w-full'>
			{label && (
				<label className='text-base' htmlFor={name}>
					{label}
				</label>
			)}
			<input
				type={type}
				placeholder={placeholder}
				name={name}
				id={name}
				value={value || ''}
				onChange={handleChange}
				className='block w-full rounded-lg border border-[#d9d9d9] p-2 text-sm font-medium shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base'
			/>
			{error && <p className='text-sm text-red-600'>{error}</p>}
		</div>
	);
};

export default CustomInput;
