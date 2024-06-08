import React, { useState, useEffect, useRef } from 'react';
import '/app/styles/customSelect.css';

interface DropdownProps {
	options: string[];
	value: string;
	onChange: (option: string) => void;
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
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelect = (option: string) => {
		onChange(option);
		setIsOpen(false);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='custom-dropdown' ref={dropdownRef}>
			<div
				className='custom-dropdown__selected !p-2 !pl-3 !pr-10 hover:border-[#2D81E0] focus:border-[#2D81E0] focus:outline-[#2D81E0] focus:ring focus:ring-[#DEE9F5]'
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='m-0 w-[80%] truncate p-0'>{value || placeholder}</div>
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
			{isOpen && (
				<ul className='custom-dropdown__list'>
					{options.map((option, index) => (
						<li
							key={index}
							className='custom-dropdown__item'
							onClick={() => handleSelect(option)}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CustomSelectDropdown;
