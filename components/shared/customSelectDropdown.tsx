import React from 'react';

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
		<select
			name={name}
			value={value}
			onChange={onChange}
			className={[
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
		>
			<option value='' disabled>
				{placeholder}
			</option>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);
};

export default CustomSelectDropdown;
