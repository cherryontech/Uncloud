import React, { useRef, useEffect, useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import CustomTick from '../shared/customTick';
import CustomLegend from '../shared/customLegend';
import { moodMap } from './trendLineChart';

interface HeatMapProps {
	data: { word: string; moods: { mood: string; count: number }[] }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
	const legendRef = useRef<HTMLDivElement>(null);
	const gapRef = useRef<HTMLDivElement>(null);
	const [legendHeight, setLegendHeight] = useState(0);
	const [gapHeight, setGapHeight] = useState(0);

	useEffect(() => {
		if (legendRef.current) {
			setLegendHeight(legendRef.current.getBoundingClientRect().height);
		}
		if (gapRef.current) {
			setGapHeight(gapRef.current.getBoundingClientRect().height);
		}
	}, []);

	const margin = { top: 0, right: 0, bottom: 0, left: 40 };

	return (
		<div
			style={{
				height: '26.9rem',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div className='flex justify-end pr-3' ref={legendRef}>
				<CustomLegend
					scale={scaleLinear({
						domain: [
							0,
							Math.max(...data.flatMap((d) => d.moods.map((m) => m.count))),
						],
						range: ['#E0F2FE', '#2D81E0'],
					})}
				/>
			</div>
			<div
				ref={gapRef}
				style={{ height: '0.75rem', display: 'flex', flexShrink: 0 }}
			></div>
			<ParentSize>
				{({ width, height }) => {
					// Adjust height to account for legend and gap
					const adjustedHeight = height - legendHeight - gapHeight;
					const xMax = width - margin.left - margin.right;
					const yMax = adjustedHeight - margin.bottom - margin.top - 16;

					const xScale = scaleBand<string>({
						range: [0, xMax],
						domain: data.map((d) => d.word),
						padding: 0.1,
					});

					const yScale = scaleBand<string>({
						range: [0, adjustedHeight + 14],
						domain: Object.keys(moodMap),
						padding: 0.15,
					});

					const colorScale = scaleLinear<string>({
						domain: [
							0,
							Math.max(...data.flatMap((d) => d.moods.map((m) => m.count))),
						],
						range: ['#E0F2FE', '#2D81E0'],
					});

					return (
						<svg
							width={width}
							height={height}
							style={{
								flexGrow: 1,
								overflow: 'hidden',
								flexDirection: 'column',
							}}
						>
							<g transform={`translate(${margin.left},${margin.top})`}>
								<AxisLeft
									scale={yScale}
									stroke='#333'
									tickStroke='#333'
									hideAxisLine
									hideTicks
									tickComponent={({ x, y, formattedValue }) => (
										<CustomTick
											x={x - 5}
											y={y}
											formattedValue={formattedValue as string}
										/>
									)}
								/>
								<AxisBottom
									scale={xScale}
									top={adjustedHeight + 5}
									stroke='#333'
									tickStroke='#333'
									hideAxisLine
									hideTicks
									tickLabelProps={() => ({
										fontFamily: 'Open Sans',
										fontWeight: 600,
										fill: '#706F6F',
										// dy: '1em',
										fontSize: '.625rem',
										textAnchor: 'middle',
									})}
								/>
								{data.flatMap((d) =>
									Object.keys(moodMap).map((mood) => {
										const moodData = d.moods.find((m) => m.mood === mood);
										const count = moodData ? moodData.count : 0;
										return (
											<rect
												key={`${d.word}-${mood}`}
												x={xScale(d.word) ?? 0}
												y={yScale(mood) ?? 0}
												width={xScale.bandwidth()}
												height={yScale.bandwidth()}
												fill={count === 0 ? '#F9FAFB' : colorScale(count)}
												rx={4}
											/>
										);
									})
								)}
							</g>
						</svg>
					);
				}}
			</ParentSize>
		</div>
	);
};

export default HeatMap;
