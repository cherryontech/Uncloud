import type { Meta, StoryObj } from '@storybook/react';

import LogoutConfirmation from './confirmLogout';

const meta = {
	title: 'Logout Confirmation Form',
	component: LogoutConfirmation,
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		backgrounds: {
			default: 'dark',
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof LogoutConfirmation>;

export default meta;
type Story = StoryObj<typeof LogoutConfirmation>;

export const Form: Story = {};
