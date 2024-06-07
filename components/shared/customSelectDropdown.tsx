import React from 'react';
import '/app/styles/customSelectDropdown.css';

interface DropdownProps {
	options: string[];
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	placeholder: string;
	name: string;
}

const CustomSelectDropdown: React.FC<DropdownProps> = ({
	options,
	value,
	onChange,
	placeholder,
	name,
}) => {
	return (
		<div className='relative inline-block w-full'>
			<select
				name={name}
				value={value}
				onChange={onChange}
				className={[
					'dropdown-placeholder',
					'block',
					'w-full',
					'rounded-md',
					'border',
					'text-gray',
					'border-[#D9D9D9]',
					'bg-white',
					'appearance-none',
					'p-2',
					'pl-3',
					'pr-10',
					'text-sm',
					'font-normal',
					'hover:border-[#2D81E0]',
					'focus:border-[#2D81E0]',
					'focus:outline-none',
					'focus:ring',
					'focus:ring-[#DEE9F5]',
				].join(' ')}
			>
				<option value='' disabled className='dropdown'>
					{placeholder}
				</option>
				{options.map((option) => (
					<option key={option} value={option} className='dropdown'>
						{option}
					</option>
				))}
			</select>
			<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
				<svg
					className='h-5 w-5'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</div>
		</div>
	);
};

export default CustomSelectDropdown;
