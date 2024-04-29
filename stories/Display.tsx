import React from 'react';

interface DisplayProps {
	/**
	 * What color to use
	 */
	color?: string;
	/**
	 * Heading contents
	 */
	label: string;
	type: 'd1' | 'd2';
}

export const Display = ({ color, label, type }: DisplayProps) => {
	// Switch statement to determine the size of the heading
	const size = type === 'd1' ? 'text-8xl' : 'text-7xl';
	return (
		<span className={['block', 'font-semibold', size].join(' ')}>{label}</span>
	);
};
