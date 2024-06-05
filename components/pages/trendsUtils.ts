import { MoodEntry } from '../home/calendar';
import { MoodType } from '../pages/trends';

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

export const filterFavoritesByDateRange = (moods: MoodEntry[]): MoodEntry[] => {
	return moods.filter((mood) => {
		const date = new Date(mood.date);
		return mood.favorite;
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

export const getFrequentPrompts = (
	moods: MoodEntry[]
): {
	mood: MoodType;
	prompt: string;
	count: number;
}[] => {
	const promptCounts: Record<string, Record<string, number>> = {};

	moods.forEach((mood) => {
		const moodType = mood.mood as MoodType;
		mood.reflections.forEach((reflection) => {
			const prompt = reflection.question;
			if (!promptCounts[moodType]) {
				promptCounts[moodType] = {};
			}
			if (!promptCounts[moodType][prompt]) {
				promptCounts[moodType][prompt] = 0;
			}
			promptCounts[moodType][prompt]++;
		});
	});

	return Object.keys(promptCounts).map((mood) => {
		const prompts = promptCounts[mood as MoodType];
		const mostFrequentPrompt = Object.keys(prompts).reduce((a, b) =>
			prompts[a] > prompts[b] ? a : b
		);
		return {
			mood: mood as MoodType,
			prompt: mostFrequentPrompt,
			count: prompts[mostFrequentPrompt],
		};
	});
};
