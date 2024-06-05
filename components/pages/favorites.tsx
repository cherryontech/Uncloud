// FavoriteLogs.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CaretRight } from '@phosphor-icons/react';
import { ReflectionsType } from '@/components/home/newLogPopup';

interface FavoriteLogsProps {
	favoriteLogs: {
		[date: string]: {
			mood: string;
			reflections: ReflectionsType[];
			favorite: boolean;
		};
	};
	handleLogClick: (log: {
		date: Date;
		mood: string;
		icon: string;
		reflections?: ReflectionsType[];
		favorite: boolean;
	}) => void;
	mobile?: boolean;
}
const moodNames = {
	Rainbow: 'Proud',
	Sunny: 'Confident',
	Cloudy: 'Uncertain',
	Rainy: 'Disappointed',
	Stormy: 'Stressed',
};

const FavoriteLogs: React.FC<FavoriteLogsProps> = ({
	favoriteLogs,
	handleLogClick,
	mobile,
}) => {
	console.log('Fav logs', favoriteLogs);

	const [favoriteLogDates, setFavoriteLogDates] = useState<string[]>([]);

	useEffect(() => {
		setFavoriteLogDates(
			Object.keys(favoriteLogs).filter((date) => favoriteLogs[date].favorite)
		);
	}, [favoriteLogs]);
	return (
		<div>
			{favoriteLogDates.length > 0 ? (
				favoriteLogDates.map((date) => {
					const log = favoriteLogs[date];
					if (!log) {
						return null;
					}
					console.log('Current log', log);
					return (
						<div
							key={date}
							className='flex h-20 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-blue-100 bg-boxBackground px-4  text-textPrimary hover:bg-hoverColor'
							onClick={() => {
								const dateParts = date
									.split('-')
									.map((part) => parseInt(part, 10));
								const logDate = new Date(
									dateParts[0],
									dateParts[1] - 1,
									dateParts[2]
								);
								handleLogClick({
									date: logDate,
									mood: log.mood,
									icon: `/moods/${log.mood.toLowerCase()}.svg`,
									reflections: log.reflections,
									favorite: log.favorite,
								});
							}}
						>
							<div className='justify-content flex flex-col items-center'>
								<p className='text-base font-medium text-gray-600'>
									{new Date(date).getUTCDate()}
								</p>
								<p className='text-xs text-gray-600'>
									{new Date(date).toLocaleString('default', {
										month: 'short',
										timeZone: 'UTC',
									})}
								</p>
							</div>

							<div className='h-10 border border-r border-blue-100 group-hover:border-white'></div>
							<div className='w-20'>
								<Image
									src={`/moods/${log.mood.toLowerCase()}.svg`}
									alt='Mood'
									width={200}
									height={200}
									className='w-full'
								/>
							</div>
							<div className='w-20'>
								<p className='text-sm font-medium text-black'>
									{log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
								</p>
								<p className='text-xs text-gray-500'>
									{moodNames[log.mood as keyof typeof moodNames]}
								</p>
							</div>
							<CaretRight
								className='text-black group-hover:text-blue-500'
								size={16}
								weight='bold'
							/>
						</div>
					);
				})
			) : (
				<p>No logs have been favorited yet.</p>
			)}
		</div>
	);
};

export default FavoriteLogs;
