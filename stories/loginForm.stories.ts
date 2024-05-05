import type { Meta, StoryObj } from '@storybook/react';

import LoginForm from './loginForm';

const meta = {
	title: 'Login Form',
	component: LoginForm,
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		backgrounds: {
			default: 'dark',
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof LoginForm>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Form: Story = {};
