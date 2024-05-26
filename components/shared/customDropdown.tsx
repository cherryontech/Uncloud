// import React, { useState, useEffect, useRef } from 'react';
// import '/app/styles/customSelect.css'; // Adjust the path as needed

// const CustomDropdown = ({
// 	options,
// 	value,
// 	onChange,
// }: {
// 	options: any[];
// 	value: any;
// 	onChange: (option: any) => void;
// }) => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const dropdownRef = useRef(null);

// 	const handleSelect = (option: any) => {
// 		onChange(option);
// 		setIsOpen(false);
// 	};

// 	const handleClickOutside = (event: { target: any }) => {
// 		if (
// 			dropdownRef.current &&
// 			!(dropdownRef.current as HTMLElement).contains(event.target as Node)
// 		) {
// 			setIsOpen(false);
// 		}
// 	};

// 	useEffect(() => {
// 		document.addEventListener('mousedown', handleClickOutside);
// 		return () => {
// 			document.removeEventListener('mousedown', handleClickOutside);
// 		};
// 	}, []);

// 	return (
// 		<div className='custom-dropdown' ref={dropdownRef}>
// 			<div
// 				className='custom-dropdown__selected hover:border-[#2D81E0] focus:border-[#2D81E0] focus:outline-[#2D81E0] focus:ring focus:ring-[#DEE9F5]'
// 				onClick={() => setIsOpen(!isOpen)}
// 			>
// 				{value}
// 			</div>
// 			{isOpen && (
// 				<ul className='custom-dropdown__list'>
// 					{options.map((option, index) => (
// 						<li
// 							key={index}
// 							className='custom-dropdown__item'
// 							onClick={() => handleSelect(option)}
// 						>
// 							<input
// 								type='radio'
// 								name='custom-dropdown'
// 								checked={option === value}
// 								onChange={() => handleSelect(option)}
// 								className='custom-dropdown__radio'
// 							/>
// 							{option}
// 						</li>
// 					))}
// 				</ul>
// 			)}
// 		</div>
// 	);
// };

// export default CustomDropdown;

import React, { useState, useEffect, useRef } from 'react';
import '/app/styles/customSelect.css'; // Adjust the path as needed

const CustomDropdown = ({
	options,
	value,
	onChange,
}: {
	options: any[];
	value: any;
	onChange: (option: any) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelect = (option: any) => {
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
				className='custom-dropdown__selected hover:border-[#2D81E0] focus:border-[#2D81E0] focus:outline-[#2D81E0] focus:ring focus:ring-[#DEE9F5]'
				onClick={() => setIsOpen(!isOpen)}
			>
				{value}
			</div>
			{isOpen && (
				<ul className='custom-dropdown__list'>
					{options.map((option, index) => (
						<li
							key={index}
							className='custom-dropdown__item'
							onClick={() => handleSelect(option)}
						>
							<input
								type='radio'
								name='custom-dropdown'
								checked={option === value}
								onChange={() => handleSelect(option)}
								className='custom-dropdown__radio'
							/>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CustomDropdown;
