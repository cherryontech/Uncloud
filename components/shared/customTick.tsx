import React from 'react';
import { moodMap } from '../home/trendLineChart';

interface CustomTickProps {
	x: number;
	y: number;
	formattedValue: string;
}

const CustomTick: React.FC<CustomTickProps> = ({ x, y, formattedValue }) => {
	const mood = formattedValue as keyof typeof moodMap;
	const icon = moodMap[mood]?.icon ?? '';

	return (
		<g transform={`translate(${x - 5}, ${y})`}>
			<image href={icon} x={-16} y={-16} height='2rem' width='2rem' />
		</g>
	);
};

export default CustomTick;
