import type { Meta, StoryObj } from '@storybook/react';

import ResetPasswordForm from './resetPassword';

const meta = {
	title: 'Reset Password Form',
	component: ResetPasswordForm,
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		backgrounds: {
			default: 'dark',
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;
type Story = StoryObj<typeof ResetPasswordForm>;

export const Form: Story = {};
