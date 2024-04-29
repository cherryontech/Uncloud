import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Icon } from './Icons';

const meta = {
	title: 'Icon',
	component: Icon,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: { control: 'color' },
	},
	args: {},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sun: Story = {
	args: {
		label: 'Add',
		type: 'sun',
		size: '32',
		weight: 'regular',
	},
};

export const Chart: Story = {
	args: {
		label: 'Add',
		type: 'chart-line-up',
		size: '32',
		weight: 'regular',
	},
};

export const Bulb: Story = {
	args: {
		label: 'Add',
		type: 'lightbulb-filament',
		size: '32',
		weight: 'regular',
	},
};
