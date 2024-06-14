// trendLineChart.tsx

'use client';
import React from 'react';
import { ParentSize } from '@visx/responsive';
import {
	AnimatedAxis,
	AnimatedGrid,
	AnimatedAreaSeries,
	AnimatedLineSeries,
	XYChart,
	Tooltip,
	GlyphSeries,
} from '@visx/xychart';
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

type Props = {
	moods: singleMood[];
};

const moodMap: {
	[key: string]: { value: number; color: string; icon: string };
} = {
	Rainbow: { value: 4, color: '#F9C7D7', icon: '/moods/rainbow-noface.svg' },
	Sunny: { value: 3, color: '#FFE773', icon: '/moods/sunny-noface.svg' },
	Cloudy: { value: 2, color: '#B1D5D5', icon: '/moods/cloudy-noface.svg' },
	Rainy: { value: 1, color: '#A0D1F9', icon: '/moods/rainy-noface.svg' },
	Stormy: { value: 0, color: '#AA52BF', icon: '/moods/stormy-noface.svg' },
};

const moodToColor = (mood: string): { value: number; color: string } => {
	return moodMap[mood] ?? { value: 0, color: 'black' }; // Default to 0 and black if the mood is not in the map
};

const convertMoodsToDataPoints = (moods: singleMood[]): DataPoint[] => {
	return moods
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

const CustomTick = ({
	formattedValue,
	icon,
}: {
	formattedValue: string;
	icon: string;
}) => (
	<g transform={`translate(${-20}, ${0})`}>
		<image href={icon} x={-16} y={-16} height='2rem' width='2rem' />
	</g>
);

const TrendLineChart = ({ moods }: Props) => {
	const dataPoints: DataPoint[] = convertMoodsToDataPoints(moods);

	const accessors = {
		xAccessor: (d: DataPoint) =>
			new Date(d.x).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
			}),
		yAccessor: (d: DataPoint) => d.y,
	};

	const yScaleConfig: any = {
		type: 'linear',
		domain: [-0.3, 4.3],
		tickValues: [0, 1, 2, 3, 4],
	};

	const margin = { left: 40, top: 0, right: 10, bottom: 24 };

	return (
		<ParentSize>
			{({ width, height }) => {
				const maxHeight = 219;
				const h = Math.min(height, maxHeight);
				return (
					<>
						<svg width='0' height='0'>
							<defs>
								<linearGradient id='gradient' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='0%' stopColor='#A0D1F9' stopOpacity={1.0} />
									<stop offset='100%' stopColor='#A0D1F9' stopOpacity={0} />
								</linearGradient>
							</defs>
						</svg>
						{width > 0 && maxHeight > 0 && (
							<XYChart
								width={width}
								height={maxHeight}
								xScale={{ type: 'band' }}
								yScale={yScaleConfig}
								margin={margin}
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
										fontSize: 12,
										fontFamily: 'Open Sans',
										fontWeight: 600,
										fill: '#706F6F',
									})}
									hideAxisLine
									hideTicks
									tickComponent={({ formattedValue }) => (
										<g transform={`translate(${0},${5})`}>
											<text
												style={{
													fontSize: '.625rem',
													textAnchor: 'middle',
													fontFamily: 'Open Sans',
													fontWeight: 600,
													fill: '#706F6F',
												}}
											>
												{formattedValue}
											</text>
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
										const mood = Object.values(moodMap).find(
											(mood) =>
												mood.value.toString() === formattedValue?.split('.')[0]
										);
										return (
											<CustomTick
												formattedValue={formattedValue || ''}
												icon={mood?.icon || ''}
											/>
										);
									}}
								/>
								<AnimatedAreaSeries
									dataKey='Line 1'
									data={dataPoints}
									{...accessors}
									fillOpacity={0.8}
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
									renderGlyph={({ x, y }) => {
										const validX = typeof x === 'number' ? x : 0;
										const validY = typeof y === 'number' ? y : 0;
										return (
											<circle cx={validX} cy={validY} r={4} fill='#2D81E0' />
										);
									}}
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
												moodMap[key].value ===
												tooltipData?.nearestDatum?.datum?.y
										);

										return (
											<div className='flex flex-col gap-2'>
												<div
													style={{
														color:
															tooltipData?.nearestDatum?.datum?.color ||
															'black',
													}}
												>
													{mood}{' '}
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
						)}
					</>
				);
			}}
		</ParentSize>
	);
};

export default TrendLineChart;

export { moodMap, CustomTick };
