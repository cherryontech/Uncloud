import React from 'react';

interface HeadingProps {
	/**
	 * What color to use
	 */
	color?: string;
	/**
	 * Heading contents
	 */
	label: string;
	type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subheadline';
}

export const Heading = ({ color, label, type }: HeadingProps) => {
	// Switch statement to determine the size of the heading
	let size = '';
	switch (type) {
		case 'h1':
			size = 'text-6xl';
			break;
		case 'h2':
			size = 'text-5xl';
			break;
		case 'h3':
			size = 'text-4xl';
			break;
		case 'h4':
			size = 'text-3xl';
			break;
		case 'h5':
			size = 'text-2xl';
			break;
		case 'h6':
			size = 'text-xl';
			break;
		case 'subheadline':
			size = 'text-xl';
			break;
	}
	let weight = '';
	// if type is h1, h2, h3, h4, h5, h6  set weight to font-semibold; if type is subheadline set weight to font-normal
	if (
		type === 'h1' ||
		type === 'h2' ||
		type === 'h3' ||
		type === 'h4' ||
		type === 'h5' ||
		type === 'h6'
	) {
		weight = 'font-semibold';
	} else {
		weight = 'font-normal';
	}

	let margin = '';
	// if type is h1, h2, h3, h4, h5, h6  set margin to mb-4; if type is subheadline set margin to mb-2
	if (
		type === 'h1' ||
		type === 'h2' ||
		type === 'h3' ||
		type === 'h4' ||
		type === 'h5' ||
		type === 'h6'
	) {
		margin = 'my-7';
	} else {
		margin = 'my-5';
	}
	switch (type) {
		case 'h1':
			return (
				<h1 className={['block', size, weight, margin].join(' ')}>{label}</h1>
			);
		case 'h2':
			return <h2 className={['block', size, weight].join(' ')}>{label}</h2>;
		case 'h3':
			return (
				<h3 className={['block', size, weight, margin].join(' ')}>{label}</h3>
			);
		case 'h4':
			return (
				<h4 className={['block', size, weight, margin].join(' ')}>{label}</h4>
			);
		case 'h5':
			return (
				<h5 className={['block', size, weight, margin].join(' ')}>{label}</h5>
			);
		case 'h6':
			return (
				<h6 className={['block', size, weight, margin].join(' ')}>{label}</h6>
			);
		case 'subheadline':
			return (
				<p className={['block', size, weight, margin].join(' ')}>{label}</p>
			);
	}
	return <h1 className={['block', size, weight, margin].join(' ')}>{label}</h1>;
};
