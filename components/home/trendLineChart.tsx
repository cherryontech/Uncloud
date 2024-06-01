'use client';
import React from 'react';
import {
	AnimatedAxis,
	AnimatedGrid,
	AnimatedAreaSeries,
	AnimatedLineSeries,
	XYChart,
	Tooltip,
} from '@visx/xychart';
import { GlyphSeries } from '@visx/xychart';
import '/app/styles/trends.css';
type DataPoint = {
	x: string;
	y: number;
	color: string;
};

export type singleMood = {
	date: string;
	mood: string;
};

type props = {
	moods: singleMood[];
};

const moodMap: { [key: string]: { value: number; color: string } } = {
	Rainbow: { value: 4, color: '#F9C7D7' },
	Sunny: { value: 3, color: '#FFE773' },
	Cloudy: { value: 2, color: '#B1D5D5' },
	Rainy: { value: 1, color: '#A0D1F9' },
	Stormy: { value: 0, color: '#AA52BF' },
	// Add more moods as needed
};

const moodToColor = (mood: string): { value: number; color: string } => {
	return moodMap[mood] ?? { value: 0, color: 'black' }; // Default to 0 and black if the mood is not in the map
};

const convertMoodsToDataPoints = (moods: singleMood[]): DataPoint[] => {
	const filteredData = moods.filter((moodEntry) => {
		const [year, month] = moodEntry.date.split('-').map(Number);
		return month === 5; // Change this to the desired month
	});

	return filteredData
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((moodEntry) => {
			const moodData = moodToColor(moodEntry.mood);
			return {
				x: moodEntry.date,
				y: moodData.value,
				color: moodData.color,
			};
		});
};

// Custom tick component to render colored divs
const CustomTick = ({
	formattedValue,
	color,
}: {
	formattedValue: string;
	color: string;
}) => (
	<svg
		className='relative bottom-4 right-6'
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 12 12'
		width={16}
		height={16}
	>
		<circle cx='6' cy='6' r='6' fill={color} />
	</svg>
);

const TrendLineChart = ({ moods }: props) => {
	const dataPoints: DataPoint[] = convertMoodsToDataPoints(moods);

	const accessors = {
		xAccessor: (d: DataPoint) =>
			new Date(d.x).toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
			}),
		yAccessor: (d: DataPoint) => d.y,
	};

	const yScaleConfig: any = {
		type: 'linear',
		domain: [0, 4],
		tickValues: [0, 1, 2, 3, 4],
	};

	return (
		<>
			<svg>
				<defs>
					<linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='0%' stopColor='#2D81E0' stopOpacity={0.8} />
						<stop offset='100%' stopColor='#2D81E0' stopOpacity={0} />
					</linearGradient>
				</defs>
			</svg>
			<XYChart
				height={300}
				xScale={{ type: 'band' }}
				yScale={yScaleConfig}
				margin={{ left: 80, top: 10, right: 10, bottom: 40 }}
			>
				<AnimatedGrid
					columns={true}
					rows={false}
					numTicks={dataPoints.length}
					className='grid'
				/>
				<AnimatedAxis
					orientation='bottom'
					tickLabelProps={() => ({
						dy: '1em',
						fontFamily: 'Open Sans',
						fontWeight: 600,
						fill: '#706F6F',
					})}
					hideAxisLine
					hideTicks
					tickComponent={({ formattedValue, ...tickProps }) => (
						<g transform={`translate(${0},${10})`}>
							{' '}
							{/* Increase the y value to move the ticks down */}
							<text {...tickProps}>{formattedValue}</text>
						</g>
					)}
				/>
				<AnimatedAxis
					orientation='left'
					numTicks={5}
					tickClassName={'mr-4'}
					hideAxisLine
					hideTicks
					tickComponent={({ formattedValue, ...tickProps }) => {
						const color =
							Object.values(moodMap).find(
								(mood) =>
									mood.value.toString() === formattedValue?.split('.')[0]
							)?.color || 'black';

						return (
							<g transform={`translate(${-40},${-10})`}>
								{' '}
								<CustomTick
									formattedValue={formattedValue || ''}
									color={color}
								/>
							</g>
						);
					}}
				/>
				<AnimatedAreaSeries
					dataKey='Line 1'
					data={dataPoints}
					{...accessors}
					fillOpacity={0.5}
					fill='url(#gradient)'
					stroke='none'
					renderLine={false}
				/>
				<AnimatedLineSeries
					dataKey='Line 1'
					data={dataPoints}
					{...accessors}
					stroke='#2D81E0'
					strokeWidth={1.5}
				/>
				<GlyphSeries
					dataKey='Line 1'
					data={dataPoints}
					{...accessors}
					renderGlyph={({ x, y }) => (
						<circle cx={x} cy={y} r={4} fill='#2D81E0' />
					)}
				/>
				<Tooltip<DataPoint>
					className='tooltip'
					snapTooltipToDatumX
					snapTooltipToDatumY
					showVerticalCrosshair
					showSeriesGlyphs
					renderTooltip={({ tooltipData }: any) => {
						const mood = Object.keys(moodMap).find(
							(key) =>
								moodMap[key].value === tooltipData?.nearestDatum?.datum?.y
						);

						return (
							<div className='flex flex-col gap-2'>
								<div
									style={{
										color: tooltipData?.nearestDatum?.datum?.color || 'black',
									}}
								>
									{mood} {/* Display the mood instead of the data key */}
								</div>
								{new Date(
									tooltipData?.nearestDatum?.datum?.x
								).toLocaleDateString('en-US', {
									month: '2-digit',
									day: '2-digit',
								})}
							</div>
						);
					}}
				/>
			</XYChart>
		</>
	);
};

export default TrendLineChart;
