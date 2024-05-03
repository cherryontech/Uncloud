import React from 'react';
import './button.css';

interface ButtonProps {
	/**
	 * Is this the principal call to action on the page?
	 */
	primary?: boolean;
	/**
	 * What background color to use
	 */
	backgroundColor?: string;
	/**
	 * How large should the button be?
	 */
	size?: 'small' | 'medium' | 'large';
	/**
	 * Button contents
	 */
	label: string;
	/**
	 * Optional click handler
	 */
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
	primary = false,
	size = 'medium',
	backgroundColor,
	label,
	...props
}: ButtonProps) => {
	const mode = primary ? 'button--primary' : 'button--secondary';
	return (
		<button
			type={props.type || 'button'}
			className={[
				'button',
				`button--${size}`,
				mode,
				'block',
				'w-full',
				'py-[0.625rem]',
				'px-6',
			].join(' ')}
			{...props}
		>
			{label}
			<style jsx>{`
				button {
					background-color: ${backgroundColor};
					color: ${primary ? 'white' : 'black'};
				}
			`}</style>
		</button>
	);
};
