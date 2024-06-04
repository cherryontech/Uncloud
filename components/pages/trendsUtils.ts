import { MoodEntry } from "../home/calendar";

export const filterMoodsByDateRange = (
	moods: MoodEntry[],
	startDate: Date,
	endDate: Date
): MoodEntry[] => {
	return moods.filter((mood) => {
		const date = new Date(mood.date);
		return date >= startDate && date <= endDate;
	});
};
export const filterFavoritesByDateRange = (
	moods: MoodEntry[]
): MoodEntry[] => {
	return moods.filter((mood) => {
		const date = new Date(mood.date);
		return  mood.favorite;
	});
};
export const countNonEmptyReflections = (moods: MoodEntry[]): number => {
	return moods.reduce((count, mood) => {
		const nonEmptyReflections = mood.reflections.filter(
			(reflection) => reflection.answer.trim() !== ''
		);
		return count + nonEmptyReflections.length;
	}, 0);
};
export const countNonEmptyWins = (moods: MoodEntry[]): number => {
	return moods.reduce((count, mood) => {
		const nonEmptyWins = mood.wins.filter(
			(win) => win.description.trim() !== ''
		);
		return count + nonEmptyWins.length;
	}, 0);
};
export const calculatePercentageIncrease = (
	currentCountMoods: number,
	pastCount: number
): number => {
	if (pastCount === 0) return currentCountMoods > 0 ? 100 : 0;
	return ((currentCountMoods - pastCount) / pastCount) * 100;
};
export const calculatePastDateRange = (
	currentStartDate: Date,
	currentEndDate: Date
): { pastStartDate: Date; pastEndDate: Date } => {
	const currentRangeDays =
		(currentEndDate.getTime() - currentStartDate.getTime()) /
		(1000 * 60 * 60 * 24);
	const pastEndDate = new Date(currentStartDate.getTime() - 1);
	const pastStartDate = new Date(
		pastEndDate.getTime() - currentRangeDays * (1000 * 60 * 60 * 24)
	);
	return { pastStartDate, pastEndDate };
};
