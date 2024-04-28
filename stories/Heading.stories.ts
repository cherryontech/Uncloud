import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Heading } from './Heading';

const meta = {
	title: 'Typography/Heading',
	component: Heading,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: { control: 'color' },
	},
	args: {},
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
	args: {
		label: 'Heading',
		type: 'h1',
	},
};

export const H2: Story = {
	args: {
		label: 'Heading',
		type: 'h2',
	},
};

export const H3: Story = {
	args: {
		label: 'Heading',
		type: 'h3',
	},
};

export const H4: Story = {
	args: {
		label: 'Heading',
		type: 'h4',
	},
};

export const H5: Story = {
	args: {
		label: 'Heading',
		type: 'h5',
	},
};

export const H6: Story = {
	args: {
		label: 'Heading',
		type: 'h6',
	},
};

export const Subheadline: Story = {
	args: {
		label: 'Subheadline',
		type: 'subheadline',
	},
};
