import React, { useEffect, useRef, useState } from 'react';

const ResizableSelect = ({
	options,
	value,
	onChange,
}: {
	options: any[];
	value: any;
	onChange: any;
}) => {
	const selectRef = useRef(null);
	const [width, setWidth] = useState('auto');

	useEffect(() => {
		if (selectRef.current) {
			const tempSpan = document.createElement('span');
			tempSpan.style.visibility = 'hidden';
			tempSpan.style.position = 'absolute';
			tempSpan.style.whiteSpace = 'nowrap';
			tempSpan.style.fontFamily = getComputedStyle(
				selectRef.current
			).fontFamily;
			tempSpan.style.fontSize = getComputedStyle(selectRef.current).fontSize;
			tempSpan.textContent = options.find(
				(option) => option.value === value
			)?.label;

			document.body.appendChild(tempSpan);
			const newWidth = tempSpan.clientWidth + 10; // Adding some extra padding
			document.body.removeChild(tempSpan);

			setWidth(`${newWidth}px`);
		}
	}, [value, options]);

	return (
		<select ref={selectRef} value={value} onChange={onChange} style={{ width }}>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};

export default ResizableSelect;
