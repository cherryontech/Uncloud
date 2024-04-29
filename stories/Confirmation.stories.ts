import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationMessage } from './Confirmation';

const meta = {
	title: 'Confirmation',
	component: ConfirmationMessage,
	tags: ['autodocs'],
} as Meta<typeof ConfirmationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
	args: {
		userDisplayName: 'Jane Doe',
	},
};
