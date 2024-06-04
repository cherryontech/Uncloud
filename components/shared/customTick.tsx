import React from 'react';
import { moodMap } from '../home/trendLineChart'; // Import moodMap

interface CustomTickProps {
	x: number;
	y: number;
	formattedValue: string;
}

const CustomTick: React.FC<CustomTickProps> = ({ x, y, formattedValue }) => {
	const mood = formattedValue as keyof typeof moodMap; // Ensure formattedValue is a valid key
	const icon = moodMap[mood]?.icon ?? ''; // Get the icon from the moodMap

	return (
		<g transform={`translate(${x - 5}, ${y})`}>
			<image href={icon} x={-16} y={-16} height='2rem' width='2rem' />
		</g>
	);
};

export default CustomTick;
