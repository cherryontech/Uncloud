import React from 'react';
import './button.css';

interface ButtonProps {
	/**
	 * Is this the principal call to action on the page?
	 */
	primary?: boolean;
	version?: string;
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
	label: React.ReactNode;
	/**
	 * Optional click handler
	 */
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
	primary = false,
	version,
	size = 'medium',
	backgroundColor,
	label,
	...props
}) => {
	const mode =
		version === 'primary'
			? 'button--primary'
			: version === 'secondary'
				? 'button--secondary'
				: version === 'tertiary'
					? 'button--tertiary'
					: 'button--primary';

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
