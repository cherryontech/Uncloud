'use client';
import React from 'react';
import {
	AnimatedAxis,
	AnimatedGrid,
	AnimatedLineSeries,
	XYChart,
	Tooltip,
	Axis,
} from '@visx/xychart';
import { LinePath } from '@visx/shape';

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

	return filteredData.map((moodEntry, index) => {
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
			new Date(`${d.x}T00:00:00`).toLocaleDateString('en-US', {
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
	const generateMonthDates = (year: number, month: number): string[] => {
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0);
		const dates: string[] = [];
		let currentDate = startDate;

		while (currentDate <= endDate) {
			const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			const day = String(currentDate.getDate()).padStart(2, '0');
			dates.push(`${month}/${day}`);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	};

	// Usage example:
	const monthDates = generateMonthDates(2024, 5); // May 2024

	// Generate tick values to show max 4 labels
	const tickInterval = Math.ceil(monthDates.length / 4);
	const tickValues = monthDates.filter((_, i) => i % tickInterval === 0);

	console.log(tickValues);
	return (
		<XYChart height={300} xScale={{ type: 'band' }} yScale={yScaleConfig}>
			<AnimatedAxis orientation='bottom' />
			<AnimatedAxis
				orientation='left'
				numTicks={5}
				tickClassName={'mr-4'}
				tickComponent={({ formattedValue, ...tickProps }) => {
					console.log(formattedValue);
					console.log(tickProps);
					const color =
						Object.values(moodMap).find(
							(mood) => mood.value.toString() === formattedValue?.split('.')[0]
						)?.color || 'black';

					console.log(color);
					return (
						<g transform={`translate(${-20},${-10})`}>
							<CustomTick formattedValue={formattedValue || ''} color={color} />
						</g>
					);
				}}
			/>

			{/* <AnimatedGrid columns={false} numTicks={4} /> */}
			<AnimatedLineSeries
				dataKey='Line 1'
				data={dataPoints}
				{...accessors}
				// stroke={({ datum }: { datum: DataPoint }) => datum.color} // Set stroke color based on the mood color
			/>
			<Tooltip<DataPoint>
				snapTooltipToDatumX
				snapTooltipToDatumY
				showVerticalCrosshair
				showSeriesGlyphs
				renderTooltip={({ tooltipData }: any) => (
					<div>
						<div
							style={{
								color: tooltipData?.nearestDatum?.datum?.color || 'black',
							}}
						>
							{tooltipData?.nearestDatum?.key}
						</div>
						{accessors.xAccessor(
							tooltipData?.nearestDatum?.datum || {
								x: '',
								y: 0,
								color: 'black',
							}
						)}
						{', '}
						{accessors.yAccessor(
							tooltipData?.nearestDatum?.datum || {
								x: '',
								y: 0,
								color: 'black',
							}
						)}
					</div>
				)}
			/>
		</XYChart>
	);
};

export default TrendLineChart;
