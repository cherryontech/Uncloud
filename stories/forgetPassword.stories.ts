import type { Meta, StoryObj } from '@storybook/react';

import ForgetPasswordForm from './forgetPassword';

const meta = {
	title: 'Forgot Password Form',
	component: ForgetPasswordForm,
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		backgrounds: {
			default: 'dark',
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ForgetPasswordForm>;

export default meta;
type Story = StoryObj<typeof ForgetPasswordForm>;

export const Form: Story = {};
