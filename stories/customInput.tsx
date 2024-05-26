import React, { ChangeEvent } from 'react';
import { X } from '@phosphor-icons/react';
import './customInput.css';

interface CustomInputProps {
	name: string;
	value: string;
	placeholder: string;
	label?: string;
	type: string;
	error?: string | null;
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
	const handleClear = () => {
		handleChange({
			target: { name, value: '' },
		} as ChangeEvent<HTMLInputElement>);
	};

	return (
		<div className='w-full space-y-1.5'>
			{label && (
				<label className='text-sm font-bold' htmlFor={name}>
					{label}
				</label>
			)}
			<div className='relative'>
				<input
					type={type}
					placeholder={placeholder}
					name={name}
					id={name}
					value={value || ''}
					onChange={handleChange}
					className={[
						error ? 'border-red-500' : 'border-[#D9D9D9]',
						error ? 'focus:ring-0' : 'focus:ring-[#DEE9F5]',
						error ? 'focus:outline-red-500' : 'focus:outline-[#2D81E0]',
						error ? 'focus:border-red-500' : 'focus:border-[#2D81E0]',
						'block',
						'w-full',
						'rounded-md',
						'border',
						'border-[#D9D9D9]',
						'bg-transparent',
						'p-2',
						'pl-3',
						'pr-10',
						'text-sm',
						'font-normal',
						'hover:border-[#2D81E0]',
						'focus:border-[#2D81E0]',
						'focus:outline-0',
						'focus:outline-[#2D81E0]',
						'focus:ring',
						'focus:ring-[#DEE9F5]',
						'focus:outline-none',
					].join(' ')}
				/>
				{error && (
					<div
						className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3'
						onClick={handleClear}
					>
						<X size={'1rem'} weight='light' color='#EF4444' />
					</div>
				)}
			</div>
			{/* If error is not "Incorrect email or password." then display the message */}
			{error && error !== 'Incorrect email or password.' && (
				<p className='text-sm font-semibold text-red-600'>{error}</p>
			)}

			{/* {error && <p className='text-sm font-semibold text-red-600'>{error}</p>} */}
		</div>
	);
};

export default CustomInput;
