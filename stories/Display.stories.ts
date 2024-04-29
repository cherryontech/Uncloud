import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Display } from './Display';

const meta = {
	title: 'Typography/Display',
	component: Display,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: { control: 'color' },
	},
	args: {},
} satisfies Meta<typeof Display>;

export default meta;
type Story = StoryObj<typeof meta>;

export const D1: Story = {
	args: {
		label: 'Display',
		type: 'd1',
	},
};

export const D2: Story = {
	args: {
		label: 'Display',
		type: 'd2',
	},
};
