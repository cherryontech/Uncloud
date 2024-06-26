import React from 'react';
import {
	ChartLineUp,
	LightbulbFilament,
	Sun,
	CloudSun,
	LockKey,
	EnvelopeOpen,
	ArrowClockwise,
} from '@phosphor-icons/react';
interface IconProps {
	color?: string;
	label?: string;
	weight: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
	type: string;
	size: string;
}
export const Icon = ({ color, label, weight, type, size }: IconProps) => {
	let icon = null;
	switch (type) {
		case 'chart-line-up':
			icon = <ChartLineUp weight={weight} size={size} color={color} />;
			break;
		case 'lightbulb-filament':
			icon = <LightbulbFilament weight={weight} size={size} color={color} />;
			break;
		case 'sun':
			icon = <Sun weight={weight} size={size} color={color} />;
			break;
		case 'cloud-sun':
			icon = <CloudSun weight={weight} size={size} color={color} />;
			break;
		case 'lock-key':
			icon = <LockKey weight={weight} size={size} color={color} />;
			break;
		case 'envelope-open':
			icon = <EnvelopeOpen weight={weight} size={size} color={color} />;
			break;
		case 'arrow-clockwise':
			icon = <ArrowClockwise weight={weight} size={size} color={color} />;
			break;
	}
	return <div className={['icon'].join(' ')}>{icon}</div>;
};
