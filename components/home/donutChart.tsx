import React, { useState } from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { LegendOrdinal, LegendItem, LegendLabel } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';

type MoodType = 'Rainbow' | 'Sunny' | 'Cloudy' | 'Stormy' | 'Rainy';

interface DonutChartProps {
	data: { mood: MoodType; value: number }[];
}

const moodColors = {
	Rainbow: '#F9C7D7',
	Sunny: '#FFE773',
	Cloudy: '#B1D5D5',
	Stormy: '#AA52BF',
	Rainy: '#A0D1F9',
};

const hoverColors = {
	Rainbow: '#f29bb8',
	Sunny: '#ffd700',
	Cloudy: '#8fbebe',
	Stormy: '#8a3d9e',
	Rainy: '#7bb9e8',
};

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
	const [tooltipData, setTooltipData] = useState<{
		mood: MoodType;
		value: number;
	} | null>(null);
	const [tooltipLeft, setTooltipLeft] = useState<number | null>(null);
	const [tooltipTop, setTooltipTop] = useState<number | null>(null);
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);
	const svgRef = React.useRef<SVGSVGElement>(null);

	const outerRadius = 110;
	const innerRadius = 70;
	const innerRingRadius = 65;

	const colorScale = scaleOrdinal<MoodType, string>({
		domain: data.map((d) => d.mood),
		range: data.map((d) => moodColors[d.mood]),
	});

	const handleMouseMove = (
		event: React.MouseEvent<SVGPathElement, MouseEvent>,
		data: { mood: MoodType; value: number }
	) => {
		if (svgRef.current) {
			const coords = localPoint(event) || { x: 0, y: 0 };
			const svgRect = svgRef.current.getBoundingClientRect();
			setTooltipLeft(coords.x + svgRect.left);
			setTooltipTop(coords.y + svgRect.top);
			setTooltipData(data);
			setTooltipOpen(true);
			setHoveredMood(data.mood);
		}
	};

	const handleMouseLeave = () => {
		setTooltipOpen(false);
		setHoveredMood(null);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '100%',
			}}
		>
			<svg ref={svgRef} width={outerRadius * 2} height={outerRadius * 2}>
				<Group top={outerRadius} left={outerRadius}>
					<Pie
						data={data}
						pieValue={(d) => d.value}
						outerRadius={outerRadius}
						innerRadius={innerRadius}
						cornerRadius={5}
						padAngle={0.04}
					>
						{(pie) =>
							pie.arcs.map((arc) => (
								<g key={arc.data.mood}>
									<path
										d={pie.path(arc) ?? ''}
										fill={
											hoveredMood === arc.data.mood
												? hoverColors[arc.data.mood]
												: colorScale(arc.data.mood)
										}
										onMouseMove={(event) => handleMouseMove(event, arc.data)}
										onMouseLeave={handleMouseLeave}
									/>
								</g>
							))
						}
					</Pie>
					{/* Inner ring */}
					<Pie
						data={data}
						pieValue={(d) => d.value}
						outerRadius={innerRingRadius}
						innerRadius={innerRingRadius - 6}
						cornerRadius={3}
						padAngle={0.1}
					>
						{(pie) =>
							pie.arcs.map((arc) => (
								<g key={arc.data.mood}>
									<path
										d={pie.path(arc) ?? ''}
										fill={
											hoveredMood === arc.data.mood
												? hoverColors[arc.data.mood]
												: colorScale(arc.data.mood)
										}
										onMouseMove={(event) => handleMouseMove(event, arc.data)}
										onMouseLeave={handleMouseLeave}
									/>
								</g>
							))
						}
					</Pie>
				</Group>
			</svg>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					paddingTop: '2rem',
				}}
			>
				<LegendOrdinal scale={colorScale} direction='row'>
					{(labels) =>
						labels.map((label, i) => (
							<div
								key={`legend-container-${i}`}
								style={{
									flex: '1 0 33%',
									maxWidth: '33%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									alignContent: 'center',
									padding: '0.75rem',
								}}
							>
								<LegendItem
									key={`legend-${i}`}
									margin='0.75rem'
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<svg width={10} height={10}>
										<circle cx={5} cy={5} r={5} fill={label.value} />
									</svg>
									<LegendLabel
										align='left'
										margin='0 0 0 4px'
										style={{
											color: '#706F6F',
											fontSize: '0.875rem',
											fontWeight: '600',
											paddingLeft: '0.5rem',
										}}
									>
										{label.text}
									</LegendLabel>
								</LegendItem>
							</div>
						))
					}
				</LegendOrdinal>
			</div>
			{tooltipOpen && tooltipData && (
				<TooltipWithBounds
					className='tooltip'
					key={Math.random()}
					top={tooltipTop ?? undefined}
					left={tooltipLeft ?? undefined}
					style={defaultStyles}
				>
					<div className='flex flex-col gap-1 text-sm'>
						<strong style={{ color: moodColors[tooltipData.mood] }}>
							{tooltipData.mood}
						</strong>
						<div>Logs: {tooltipData.value}</div>
					</div>
				</TooltipWithBounds>
			)}
		</div>
	);
};

export default DonutChart;
