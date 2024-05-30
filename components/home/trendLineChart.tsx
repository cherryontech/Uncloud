'use client';
import React from 'react';
import {
	AnimatedAxis, 
	AnimatedGrid,
	AnimatedLineSeries,
	XYChart,
	Tooltip,
} from '@visx/xychart';
import Image from 'next/image';

type DataPoint = {
	x: string;
	y: number;
};

const data1: DataPoint[] = [
	{ x: '2020-01-01', y: 50 },
	{ x: '2020-01-02', y: 10 },
	{ x: '2020-01-03', y: 20 },
];

const data2: DataPoint[] = [
	{ x: '2020-01-01', y: 30 },
	{ x: '2020-01-02', y: 40 },
	{ x: '2020-01-03', y: 80 },
];

const accessors = {
	xAccessor: (d: DataPoint) =>
		new Date(`${d.x}T00:00:00`).toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
		}),
	yAccessor: (d: DataPoint) => d.y,
};

const TrendLineChart: React.FC = () => {
	return (
		<XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
			<AnimatedAxis orientation='bottom' />
			<AnimatedAxis orientation='left' />
			<AnimatedGrid columns={false} numTicks={4} />
			<AnimatedLineSeries dataKey='Line 1' data={data1} {...accessors} />
			<AnimatedLineSeries dataKey='Line 2' data={data2} {...accessors} />
			<Tooltip<DataPoint>
				snapTooltipToDatumX
				snapTooltipToDatumY
				showVerticalCrosshair
				showSeriesGlyphs
				renderTooltip={({ tooltipData, colorScale }: any) => (
					<div>
						<div
							style={{
								color: colorScale?.(tooltipData?.nearestDatum?.key || ''),
							}}
						>
							{tooltipData?.nearestDatum?.key}
						</div>
						{accessors.xAccessor(
							tooltipData?.nearestDatum?.datum || { x: '', y: 0 }
						)}
						{', '}
						{accessors.yAccessor(
							tooltipData?.nearestDatum?.datum || { x: '', y: 0 }
						)}
					</div>
				)}
			/>
		</XYChart>
	);
};

export default TrendLineChart;
