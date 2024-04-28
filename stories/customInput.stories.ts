// Import statements
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import CustomInput from './customInput';

const meta = {
	title: 'Input',
	component: CustomInput,
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
	argTypes: {
		type: { control: 'select', options: ['text', 'email', 'password'] },
	},
} satisfies Meta<typeof CustomInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Name: Story = {
	args: {
		type: 'text',
		placeholder: 'Please type your preferred name.',
		label: 'What should we call you?',
		name: 'name',
	},
};

export const Email: Story = {
	args: {
		type: 'email',
		placeholder: 'Please type your email.',
		label: "What's your email?",
		name: 'emailAddress',
	},
};
