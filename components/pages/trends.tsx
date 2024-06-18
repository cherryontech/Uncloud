import React, { useEffect, useState, useRef } from 'react';
import TrendLineChart, { singleMood } from '../home/trendLineChart';
import HeatMap from '../home/heatMapChart';
import { getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import { prepareHeatMapData } from '../utils/textProcessing';
import PercentageCard from '../trends/percentageCard';
import { Tooltip, useTooltip } from '@visx/tooltip';
import { Question, TrendUp, TrendDown } from '@phosphor-icons/react';
import '/app/styles/trends.css';
import { MoodEntry } from '../home/calendar';
import Image from 'next/image';
import {
	calculatePastDateRange,
	calculatePercentageIncrease,
	countNonEmptyReflections,
	countNonEmptyWins,
	filterFavoritesByDateRange,
	filterMoodsByDateRange,
	getCurrentMonthRange,
	getFrequentPrompts,
} from './trendsUtils';
import DonutChart from '../home/donutChart';
import FrequentReflectionPrompts from '../home/frequentPromptsChart';
import CustomDateRangePicker, { DateRangeState } from '../home/dateRangePicker';

export type MoodType = 'Rainbow' | 'Sunny' | 'Cloudy' | 'Stormy' | 'Rainy';

const Trends = () => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<MoodEntry[]>([]);
	const [currentMoodsState, setCurrentMoodsState] = useState<MoodEntry[]>([]);
	const [currentCountMoods, setCurrentCountMoods] = useState<number>(0);
	const [heatMapData, setHeatMapData] = useState<any[]>([]);
	const [frequentPrompts, setFrequentPrompts] = useState<
		{
			mood: MoodType;
			prompt: string;
			count: number;
		}[]
	>([]);

	// Tooltip state
	const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
		useTooltip<React.ReactNode>();

	const [percentageIncreaseMoods, setPercentageIncreaseMoods] =
		useState<number>(0);
	const [currentCountFavorites, setCurrentCountFavorites] = useState<number>(0);
	const [percentageIncreaseFavorites, setPercentageIncreaseFavorites] =
		useState<number>(0);
	const [currentCountWins, setCurrentCountWins] = useState<number>(0);
	const [percentageIncreaseWins, setPercentageIncreaseWins] =
		useState<number>(0);
	const [currentCountReflections, setCurrentCountReflections] =
		useState<number>(0);
	const [percentageIncreaseReflections, setPercentageIncreaseReflections] =
		useState<number>(0);
	const currentMonthRange = getCurrentMonthRange();

	const [state, setState] = useState<DateRangeState[]>([
		{
			startDate: currentMonthRange.start,
			endDate: currentMonthRange.end,
			key: 'selection',
		},
	]);

	const [hasData, setHasData] = useState<boolean>(false);

	useEffect(() => {
		const { pastStartDate, pastEndDate } = calculatePastDateRange(
			state[0].startDate,
			state[0].endDate
		);

		const currentMoods = filterMoodsByDateRange(
			moods,
			state[0].startDate,
			state[0].endDate
		);

		setCurrentMoodsState(currentMoods);
		const heatmapData = prepareHeatMapData(currentMoods);
		setHeatMapData(heatmapData);
		const pastMoods = filterMoodsByDateRange(moods, pastStartDate, pastEndDate);

		const currentMoodCount = currentMoods.length;
		const pastMoodCount = pastMoods.length;

		setCurrentCountMoods(currentMoodCount);
		setPercentageIncreaseMoods(
			calculatePercentageIncrease(currentMoodCount, pastMoodCount)
		);

		const currentFavorites = filterFavoritesByDateRange(currentMoods);
		const pastFavorites = filterFavoritesByDateRange(pastMoods);

		const currentFavoriteCount = currentFavorites.length;
		const pastFavoriteCount = pastFavorites.length;

		setCurrentCountFavorites(currentFavoriteCount);
		setPercentageIncreaseFavorites(
			calculatePercentageIncrease(currentFavoriteCount, pastFavoriteCount)
		);

		const currentReflectionCount = countNonEmptyReflections(currentMoods);
		const pastReflectionCount = countNonEmptyReflections(pastMoods);

		setCurrentCountReflections(currentReflectionCount);
		setPercentageIncreaseReflections(
			calculatePercentageIncrease(currentReflectionCount, pastReflectionCount)
		);

		const currentWinCount = countNonEmptyWins(currentMoods);
		const pastWinCount = countNonEmptyWins(pastMoods);

		setCurrentCountWins(currentWinCount);
		setPercentageIncreaseWins(
			calculatePercentageIncrease(currentWinCount, pastWinCount)
		);

		const prompts = getFrequentPrompts(currentMoods);
		setFrequentPrompts(prompts);

		// Check if there is data for any chart
		setHasData(
			currentMoods.length > 0 ||
				heatmapData.length > 0 ||
				prompts.length > 0 ||
				moodData.some((data) => data.value > 0)
		);
	}, [moods, state[0].startDate, state[0].endDate]);

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData) => {
				if (userData && userData.moods) {
					setMoods(userData.moods);
				}
			});
		}
	}, [user, isUpdated]);

	// Create separate references for each question mark
	const questionMarkRefs = {
		moodFlow: useRef<HTMLDivElement>(null),
		frequentWords: useRef<HTMLDivElement>(null),
		moodAnalysis: useRef<HTMLDivElement>(null),
		promptFrequency: useRef<HTMLDivElement>(null),
	};

	const handleMouseEnter = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		message: string,
		refKey: 'moodFlow' | 'frequentWords' | 'moodAnalysis' | 'promptFrequency'
	) => {
		const targetRect =
			questionMarkRefs[refKey].current?.getBoundingClientRect();
		if (targetRect) {
			showTooltip({
				tooltipData: message,
				tooltipLeft: targetRect.left + targetRect.width / 2,
				tooltipTop: targetRect.bottom + window.scrollY, // Adjust as needed
			});
		}
	};

	const moodCounts = currentMoodsState.reduce(
		(acc, mood) => {
			const moodType = mood.mood as MoodType; // Type assertion
			acc[moodType] = (acc[moodType] || 0) + 1;
			return acc;
		},
		{} as Record<MoodType, number>
	);

	const moodData: { mood: MoodType; value: number }[] = [
		{ mood: 'Rainbow', value: moodCounts['Rainbow'] || 0 },
		{ mood: 'Sunny', value: moodCounts['Sunny'] || 0 },
		{ mood: 'Cloudy', value: moodCounts['Cloudy'] || 0 },
		{ mood: 'Stormy', value: moodCounts['Stormy'] || 0 },
		{ mood: 'Rainy', value: moodCounts['Rainy'] || 0 },
	];

	return (
		<div className='flex flex-col gap-5'>
			<div>
				<CustomDateRangePicker state={state} setState={setState} />
			</div>
			<div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
				<PercentageCard
					count={currentCountMoods}
					percentage={Math.abs(percentageIncreaseMoods).toFixed(2)}
					isNegative={percentageIncreaseMoods < 0}
					icon={'/cloudtrend.svg'}
					description={'Total mood logs completed'}
					growthArrow={
						percentageIncreaseMoods < 0 ? (
							<TrendDown color='#2D81E0' className='h-full w-full' />
						) : (
							<TrendUp color='#2D81E0' className='h-full w-full' />
						)
					}
				/>
				<PercentageCard
					count={currentCountFavorites}
					percentage={Math.abs(percentageIncreaseFavorites).toFixed(2)}
					isNegative={percentageIncreaseFavorites < 0}
					icon={'/favorite.svg'}
					description={'Total mood logs favorited'}
					growthArrow={
						percentageIncreaseFavorites < 0 ? (
							<TrendDown color='#FE5B90' className='h-full w-full' />
						) : (
							<TrendUp color='#FE5B90' className='h-full w-full' />
						)
					}
				/>
				<PercentageCard
					count={currentCountReflections}
					percentage={Math.abs(percentageIncreaseReflections).toFixed(2)}
					isNegative={percentageIncreaseReflections < 0}
					icon={'/reflections.svg'}
					description={'Total reflections completed'}
					growthArrow={
						percentageIncreaseReflections < 0 ? (
							<TrendDown color='#68DAB8' className='h-full w-full' />
						) : (
							<TrendUp color='#68DAB8' className='h-full w-full' />
						)
					}
				/>
				<PercentageCard
					count={currentCountWins}
					percentage={Math.abs(percentageIncreaseWins).toFixed(2)}
					isNegative={percentageIncreaseWins < 0}
					icon={'/wins.svg'}
					description={'Total wins completed'}
					growthArrow={
						percentageIncreaseWins < 0 ? (
							<TrendDown color='#FE8034' className='h-full w-full' />
						) : (
							<TrendUp color='#FE8034' className='h-full w-full' />
						)
					}
				/>
			</div>

			{/* Conditional rendering based on the presence of data */}
			{hasData ? (
				<>
					<div className='grid h-fit w-full gap-5 md:grid-cols-2'>
						{currentMoodsState.length > 0 && (
							<div className='trends-card gap-12'>
								<div className='flex w-full flex-row items-center justify-between'>
									<span className='h-[2.0625rem] text-2xl font-semibold leading-normal'>
										Mood Flow
									</span>
									<div
										ref={questionMarkRefs.moodFlow}
										className='relative flex max-h-[1.5rem] items-center justify-center'
										onMouseEnter={(event) =>
											handleMouseEnter(
												event,
												'This chart shows the flow of your moods over time.',
												'moodFlow'
											)
										}
										onMouseLeave={hideTooltip}
									>
										<Question size={24} color={'#706F6F'} />
									</div>
								</div>
								<TrendLineChart moods={currentMoodsState} />
							</div>
						)}
						{heatMapData.length > 0 && (
							<div className='trends-card gap-4'>
								<div className='flex w-full flex-row items-center justify-between'>
									<span className='h-[2.0625rem] text-2xl font-semibold leading-normal'>
										Frequent Words
									</span>
									<div
										ref={questionMarkRefs.frequentWords}
										className='relative flex max-h-[1.5rem] items-center justify-center'
										onMouseEnter={(event) =>
											handleMouseEnter(
												event,
												'This chart shows the most frequently used words in your entries.',
												'frequentWords'
											)
										}
										onMouseLeave={hideTooltip}
									>
										<Question size={24} color={'#706F6F'} />
									</div>
								</div>
								<HeatMap data={heatMapData} />
							</div>
						)}
					</div>
					<div className='grid gap-5 md:grid-cols-[2fr_5fr]'>
						{moodData.some((data) => data.value > 0) && (
							<div className='trends-card gap-12'>
								<div className='flex w-full flex-row items-center justify-between'>
									<span className='h-[2.0625rem] text-2xl font-semibold leading-normal'>
										Mood Analysis
									</span>
									<div
										ref={questionMarkRefs.moodAnalysis}
										className='relative flex max-h-[1.5rem] items-center justify-center'
										onMouseEnter={(event) =>
											handleMouseEnter(
												event,
												'This chart shows a breakdown of your selected moods.',
												'moodAnalysis'
											)
										}
										onMouseLeave={hideTooltip}
									>
										<Question size={24} color={'#706F6F'} />
									</div>
								</div>
								<DonutChart data={moodData} />
							</div>
						)}
						{frequentPrompts.length > 0 && (
							<div className='trends-card gap-8'>
								<div className='flex w-full flex-row items-center justify-between'>
									<span className='h-[2.0625rem] text-2xl font-semibold leading-normal'>
										Frequent Reflection Prompts
									</span>
									<div
										ref={questionMarkRefs.promptFrequency}
										className='relative flex max-h-[1.5rem] items-center justify-center'
										onMouseEnter={(event) =>
											handleMouseEnter(
												event,
												'This chart shows the most frequently used prompts for your reflections.',
												'promptFrequency'
											)
										}
										onMouseLeave={hideTooltip}
									>
										<Question size={24} color={'#706F6F'} />
									</div>
								</div>
								<FrequentReflectionPrompts prompts={frequentPrompts} />
							</div>
						)}
					</div>
				</>
			) : (
				<div className='flex flex-col items-center justify-center p-5'>
					<div className='h-auto w-[11.125rem]'>
						<Image
							src='/moods/greyWithFace.svg'
							alt='Empty'
							width={200}
							height={200}
							className='w-full'
						/>
					</div>
					<span className='text-lg font-semibold text-gray-500'>
						Start logging your moods to view your trends!
					</span>
				</div>
			)}

			{tooltipData && (
				<Tooltip
					left={tooltipLeft}
					top={tooltipTop}
					style={{
						position: 'absolute',
						backgroundColor: 'white',
						color: 'black',
						border: '1px solid black',
						borderRadius: '4px',
						padding: '8px',
						fontSize: '12px',
						pointerEvents: 'none',
						transform: 'translate(-100%, 0)',
						width: '10rem',
					}}
				>
					{tooltipData}
				</Tooltip>
			)}
		</div>
	);
};

export default Trends;
