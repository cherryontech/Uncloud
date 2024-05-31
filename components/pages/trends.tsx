'use client';
import React, { useEffect, useState } from 'react';
import TrendLineChart, { singleMood } from '../home/trendLineChart';
import { getUser } from '../utils/serverFunctions';
import { useAuth } from '@/app/context/UserProvider';
import { formatValueTypeToYYYYMMDD } from '../utils/reusableFunctions';

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
			<h1>Trends</h1>
			<p>This is the trends page.</p>
			{moods && moods.length > 0 && <TrendLineChart moods={moods} />}
		</div>
	);
};

export default Trends;
