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
		size: {
			control: 'select',
			options: [
				'1rem',
				'1.5rem',
				'2rem',
				'2.5rem',
				'3rem',
				'3rem',
				'3.5rem',
				'4rem',
				'5rem',
				'6rem',
			],
		},
		type: {
			control: 'select',
			options: ['cloud-sun', 'chart-line-up', 'lightbulb-filament', 'sun'],
		},
		weight: {
			control: 'select',
			options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
		},
	},
	args: {},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sun: Story = {
	args: {
		label: 'Add',
		type: 'sun',
		size: '2rem',
		weight: 'regular',
	},
};

export const Chart: Story = {
	args: {
		label: 'Add',
		type: 'chart-line-up',
		size: '2rem',
		weight: 'regular',
	},
};

export const Bulb: Story = {
	args: {
		label: 'Add',
		type: 'lightbulb-filament',
		size: '2rem',
		weight: 'regular',
	},
};
