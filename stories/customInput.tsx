import React, { ChangeEvent } from 'react';
import { X } from '@phosphor-icons/react';
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
	const handleClear = () => {
		handleChange({
			target: { name, value: '' },
		} as ChangeEvent<HTMLInputElement>);
	};

	return (
		<div className='w-full space-y-1.5'>
			<label className='text-sm font-bold' htmlFor={name}>
				{label}
			</label>
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

			{error && <p className='text-sm font-semibold text-red-600'>{error}</p>}
		</div>
	);
};

export default CustomInput;
