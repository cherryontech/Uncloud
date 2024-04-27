import type { Meta, StoryObj } from '@storybook/react';

import RegisterForm from './registerForm';

const meta = {
	title: 'Registration Form',
	component: RegisterForm,
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		backgrounds: {
			default: 'dark',
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof RegisterForm>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Form: Story = {};
