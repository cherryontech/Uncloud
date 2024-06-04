import React, { useEffect, useState } from 'react';
import TrendLineChart, { singleMood } from '../home/trendLineChart';
import { getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import { prepareHeatMapData } from '../utils/textProcessing';
import PercentageCard from '../trends/percentageCard';
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6';
import HeatMap from '../home/heatMapChart';

const Trends = () => {
	const { user, isUpdated } = useAuth();
	const [moods, setMoods] = useState<singleMood[]>([]);
	const [heatMapData, setHeatMapData] = useState<any[]>([]);

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData) => {
				if (userData && userData.moods) {
					setMoods(userData.moods);
					const heatmapData = prepareHeatMapData(userData.moods);
					setHeatMapData(heatmapData);
				}
			});
		}
	}, [user, isUpdated]);

	return (
		<div className='flex flex-col gap-5'>
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
			<div className='grid h-full w-full gap-5 md:grid-cols-2'>
				<div className='flex h-[30rem] flex-col gap-[3rem] px-6 py-8'>
					{moods && moods.length > 0 && (
						<>
							<span className='h-[2.1rem] text-2xl font-semibold'>
								Mood Flow
							</span>
							<TrendLineChart moods={moods} />
						</>
					)}
				</div>
				<div className='flex h-[30rem] flex-col gap-4 px-6 py-8'>
					{heatMapData.length > 0 && (
						<>
							<span className='h-[2.1rem] text-2xl font-semibold'>
								Frequent Words
							</span>
							<HeatMap data={heatMapData} />
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Trends;
