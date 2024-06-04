'use client';
import React, { useEffect, useState } from 'react';
import TrendLineChart, { singleMood } from '../home/trendLineChart';
import { getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import PercentageCard from '../trends/percentageCard';
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';
import { MoodEntry } from '../home/calendar';
import {
	calculatePastDateRange,
	calculatePercentageIncrease,
	countNonEmptyReflections,
	countNonEmptyWins,
	filterFavoritesByDateRange,
	filterMoodsByDateRange,
} from './trendsUtils';

const Trends = () => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<MoodEntry[]>([]);
	const [currentCountMoods, setCurrentCountMoods] = useState<number>(0);

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
	const [currentStartDate, setCurrentStartDate] =
		useState<string>('2024-05-03');
	const [currentEndDate, setCurrentEndDate] = useState<string>('2024-06-03');

	useEffect(() => {
		const currentStart = new Date(currentStartDate);
		const currentEnd = new Date(currentEndDate);
		const { pastStartDate, pastEndDate } = calculatePastDateRange(
			currentStart,
			currentEnd
		);

		const currentMoods = filterMoodsByDateRange(
			moods,
			currentStart,
			currentEnd
		);
		const pastMoods = filterMoodsByDateRange(moods, pastStartDate, pastEndDate);
		console.log(currentMoods);
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
	}, [moods, currentStartDate, currentEndDate]);
	console.log(currentCountMoods);
	useEffect(() => {
		if (user) {
			getUser(user.uid);
		}
	}, [user, isUpdated]);

	const [selectedFilters, setSelectedFilters] = useState({
		Rainbow: false,
		Sunny: false,
		Cloudy: false,
		Rainy: false,
		Stormy: false,
	});

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData) => {
				if (userData && userData.moods) {
					console.log(userData.moods);
					setMoods(userData.moods);
				}
			});
		}
	}, [user, isUpdated]);

	return (
		<div>
			<div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
				<PercentageCard
					count={currentCountMoods}
					percentage={Math.abs(percentageIncreaseMoods).toFixed(2)}
					isNegative={percentageIncreaseMoods < 0}
					icon={'/cloudtrend.svg'}
					description={'Total logs'}
					growthArrow={
						percentageIncreaseMoods < 0 ? (
							<FaArrowTrendDown className='text-blueColor' size={24} />
						) : (
							<FaArrowTrendUp className='text-blueColor' size={24} />
						)
					}
				/>
				<PercentageCard
					count={currentCountFavorites}
					percentage={Math.abs(percentageIncreaseFavorites).toFixed(2)}
					isNegative={percentageIncreaseFavorites < 0}
					icon={'/favorite.svg'}
					description={'Total favorited'}
					growthArrow={
						percentageIncreaseFavorites < 0 ? (
							<FaArrowTrendDown className='text-[#FE5B90]' size={24} />
						) : (
							<FaArrowTrendUp className='text-[#FE5B90]' size={24} />
						)
					}
				/>
				<PercentageCard
					count={currentCountReflections}
					percentage={Math.abs(percentageIncreaseReflections).toFixed(2)}
					isNegative={percentageIncreaseReflections < 0}
					icon={'/reflections.svg'}
					description={'Total reflection prompts'}
					growthArrow={
						percentageIncreaseReflections < 0 ? (
							<FaArrowTrendDown className='text-[#68DAB8]' size={24} />
						) : (
							<FaArrowTrendUp className='text-[#68DAB8]' size={24} />
						)
					}
				/>
				<PercentageCard
					count={currentCountWins}
					percentage={Math.abs(percentageIncreaseWins).toFixed(2)}
					isNegative={percentageIncreaseWins < 0}
					icon={'/wins.svg'}
					description={'Total wins'}
					growthArrow={
						percentageIncreaseWins < 0 ? (
							<FaArrowTrendDown className='text-[#FE8034]' size={24} />
						) : (
							<FaArrowTrendUp className='text-[#FE8034]' size={24} />
						)
					}
				/>
			</div>
			<p>This is the trends page.</p>
			{moods && moods.length > 0 && <TrendLineChart moods={moods} />}
		</div>
	);
};

export default Trends;
