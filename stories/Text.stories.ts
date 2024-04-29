import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Text } from './Text';

const meta = {
	title: 'Typography/Text-Styles',
	component: Text,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		color: { control: 'color' },
	},
	args: {},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BodyLarge: Story = {
	args: {
		label: 'Body Large',
		type: 'body-large',
	},
};

export const BodySmall: Story = {
	args: {
		label: 'Body Small',
		type: 'body-small',
	},
};

export const Title: Story = {
	args: {
		label: 'Title',
		type: 'title',
	},
};

export const Menu: Story = {
	args: {
		label: 'Menu',
		type: 'menu',
	},
};

export const ButtonSmall: Story = {
	args: {
		label: 'Button Small',
		type: 'button-small',
	},
};

export const ButtonLarge: Story = {
	args: {
		label: 'Button Large',
		type: 'button-large',
	},
};

export const Caption: Story = {
	args: {
		label: 'Caption',
		type: 'caption',
	},
};

export const Chip: Story = {
	args: {
		label: 'Chip',
		type: 'chip',
	},
};
