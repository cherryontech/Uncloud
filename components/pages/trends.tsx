'use client';
import React, { useEffect, useState } from 'react';
import TrendLineChart, { singleMood } from '../home/trendLineChart';
import { getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';
import PercentageCard from '../trends/percentageCard';
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';

const Trends = () => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<singleMood[]>([]);
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
					count={8}
					percentage={12}
					isNegative={false}
					icon={'/cloudtrend.svg'}
					growthArrow={<FaArrowTrendUp className='text-blueColor' size={24} />}
				/>
				<PercentageCard
					count={8}
					percentage={12}
					isNegative={false}
					icon={'/favorite.svg'}
					growthArrow={
						<FaArrowTrendDown className='text-blueColor' size={24} />
					}
				/>
				<PercentageCard
					count={8}
					percentage={12}
					isNegative={true}
					icon={'/reflections.svg'}
					growthArrow={<FaArrowTrendUp className='text-blueColor' size={24} />}
				/>
				<PercentageCard
					count={8}
					percentage={12}
					isNegative={false}
					icon={'/wins.svg'}
					growthArrow={<FaArrowTrendUp className='text-blueColor' size={24} />}
				/>
			</div>
			<p>This is the trends page.</p>
			{moods && moods.length > 0 && <TrendLineChart moods={moods} />}
		</div>
	);
};

export default Trends;
