import React from 'react';
import CustomDropdown from '../shared/customDropdown'; // Adjust the path as needed

const DropdownInput = ({
	options,
	name,
	value,
	handleChange,
}: {
	options: any[];
	name: string;
	value: any;
	handleChange: (event: { target: { name: string; value: any } }) => void;
}) => {
	return (
		<CustomDropdown
			options={options}
			value={value}
			onChange={(newValue) =>
				handleChange({ target: { name, value: newValue } })
			}
		/>
	);
};

export default DropdownInput;
