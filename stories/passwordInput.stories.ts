// Import statements
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import PasswordInput from './passwordInput';

const meta = {
	title: 'Input: Password',
	component: PasswordInput,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
	},
	args: {
		// The name of the element that's submitted to the server
		name: 'input',
		// The  value of the input field
		value: '',
		// The text visible in the input field when it is empty
		placeholder: 'placeholder',
		// The label visible alongside (above) the input field
		label: 'label',
		// The type of the input field
		type: 'text',
		handleChange: fn(),
		error: '',
	},
	argTypes: {},
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hidden: Story = {
	args: {
		type: 'password',
		placeholder: 'Please type in your password.',
		label: 'Password',
		name: 'password',
	},
};
