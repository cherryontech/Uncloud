import React from 'react';
import { scaleLinear } from '@visx/scale';
import { LegendLinear } from '@visx/legend';

interface CustomLegendProps {
	scale: ReturnType<typeof scaleLinear>;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ scale }) => {
	const labels = scale.ticks(5).map((tick) => ({
		label: Math.round(Number(tick)).toString(),
		color: scale(tick) as string,
	}));

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				backgroundColor: 'white',
				color: '#D9D9D9',
				gap: '0.625rem',
				fontSize: '0.8125rem',
				paddingBottom: '0.75rem',
				lineHeight: '1.25rem',
			}}
		>
			<span style={{}}>Less</span>
			{labels.map((label, i) => (
				<div
					key={i}
					style={{
						backgroundColor: label.color,
						width: '1.25rem',
						height: '1.25rem',
						borderRadius: '0.25rem',
					}}
				/>
			))}
			<span style={{}}>More</span>
		</div>
	);
};

export default CustomLegend;
