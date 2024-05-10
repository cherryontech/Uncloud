import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProgressTracker } from './progressTracker';

const meta = {
	title: 'Progress Tracker',
	component: ProgressTracker,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		totalSteps: { control: 'number' },
		currentStep: { control: 'number' },
	},
	args: {},
} satisfies Meta<typeof ProgressTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {
	args: {
		totalSteps: 5,
		currentStep: 1,
	},
};

export const Second: Story = {
	args: {
		totalSteps: 5,
		currentStep: 2,
	},
};
