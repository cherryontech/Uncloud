import React from 'react';
import { ChartLineUp, LightbulbFilament, Sun } from '@phosphor-icons/react';
interface IconProps {
	color?: string;
	label?: string;
	weight: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
	type: 'chart-line-up' | 'lightbulb-filament' | 'sun';
	size: '16' | '24' | '32';
}
export const Icon = ({ color, label, weight, type, size }: IconProps) => {
	let icon = null;
	switch (type) {
		case 'chart-line-up':
			icon = (
				<ChartLineUp weight={weight} size={parseInt(size)} color={color} />
			);
			break;
		case 'lightbulb-filament':
			icon = (
				<LightbulbFilament
					weight={weight}
					size={parseInt(size)}
					color={color}
				/>
			);
			break;
		case 'sun':
			icon = <Sun weight={weight} size={parseInt(size)} color={color} />;
			break;
	}
	return <div className={['icon'].join(' ')}>{icon}</div>;
};
