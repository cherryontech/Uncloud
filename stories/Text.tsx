import React from 'react';

interface TextProps {
	/**
	 * What color to use
	 */
	color?: string;
	/**
	 * Text contents
	 */
	label: string;
	type:
		| 'body-large'
		| 'body-small'
		| 'title'
		| 'menu'
		| 'button-small'
		| 'button-large'
		| 'caption'
		| 'chip';
}

export const Text = ({ color, label, type }: TextProps) => {
	// Switch statement to determine the size of the text
	let size = '';
	let weight = '';
	let transform = '';
	let tracking = '';
	switch (type) {
		case 'body-large':
			size = 'text-base';
			weight = 'font-normal';
			color = 'textPrimary';
			transform = 'normal-case';
			tracking = 'normal';
			break;
		case 'body-small':
			size = 'text-sm';
			weight = 'font-normal';
			color = 'textSecondary';
			transform = 'normal-case';
			tracking = 'normal';
			break;
		case 'title':
			size = 'text-lg';
			weight = 'font-semibold';
			color = 'textPrimary';
			tracking = 'normal';
			break;
		case 'menu':
			size = 'text-base';
			weight = 'font-semibold';
			color = 'textPrimary';
			transform = 'normal-case';
			tracking = 'normal';
			break;
		case 'button-small':
			size = 'text-sm';
			weight = 'font-bold';
			color = 'textPrimary';
			transform = 'normal-case';
			tracking = 'normal';
			break;
		case 'button-large':
			size = 'text-base';
			weight = 'font-bold';
			color = 'textPrimary';
			transform = 'normal-case';
			tracking = 'normal';
			break;
		case 'caption':
			size = 'text-caption';
			weight = 'font-semibold';
			color = 'textSecondary';
			transform = 'normal-case';
			tracking = 'normal';
			break;
		case 'chip':
			size = 'text-xs';
			weight = 'font-extrabold';
			color = 'textPrimary';
			transform = 'uppercase';
			tracking = '[10%]';
			break;
	}

	// if type is body-small or body-large return <p> type, otherwise return <span> type
	if (type === 'body-small' || type === 'body-large') {
		return (
			<p className={[size, weight, color, transform].join(' ')}>{label}</p>
		);
	} else {
		return (
			<span className={[size, weight, color, transform].join(' ')}>
				{label}
			</span>
		);
	}
};
