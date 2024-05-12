import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ProgressBar from './progressBar';

const meta = {
	title: 'Progress Tracker V2',
	component: ProgressBar,
	parameters: {
		layout: 'fullscreen',
	},
	tags: [],
	argTypes: {
		progress: { control: 'number' },
	},
	args: {},
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quarter: Story = {
	args: {
		progress: 25,
	},
};

export const Half: Story = {
	args: {
		progress: 50,
	},
};
