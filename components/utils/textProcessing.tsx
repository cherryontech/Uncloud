// utils/textProcessing.ts

import stopwords from 'stopwords-iso';

const preprocessText = (text: string): string[] => {
	const words = text
		.toLowerCase()
		.split(/\W+/)
		.filter((word) => !stopwords['en'].includes(word) && word.length > 0);
	return words;
};

const countWordFrequencies = (
	logs: any[]
): Record<string, Record<string, number>> => {
	const wordCounts: Record<string, Record<string, number>> = {};

	logs.forEach((log) => {
		const { reflections, wins } = log;
		let allText = '';

		if (reflections) {
			reflections.forEach((reflection: any) => {
				allText += ` ${reflection.answer}`;
			});
		}

		if (wins) {
			wins.forEach((win: any) => {
				allText += ` ${win.description}`;
			});
		}

		const words = preprocessText(allText);
		words.forEach((word) => {
			if (!wordCounts[word]) {
				wordCounts[word] = {};
			}
			if (!wordCounts[word][log.mood]) {
				wordCounts[word][log.mood] = 0;
			}
			wordCounts[word][log.mood] += 1;
		});
	});

	return wordCounts;
};

const getTopWordsByMood = (
	wordCounts: Record<string, Record<string, number>>,
	topN: number
) => {
	const topWords = Object.entries(wordCounts)
		.sort((a, b) => {
			const aTotal = Object.values(a[1]).reduce((sum, val) => sum + val, 0);
			const bTotal = Object.values(b[1]).reduce((sum, val) => sum + val, 0);
			return bTotal - aTotal;
		})
		.slice(0, topN)
		.map(([word, counts]) => ({ word, counts }));

	return topWords;
};

const prepareHeatMapData = (logs: any[], topN = 6) => {
	const wordCounts = countWordFrequencies(logs);
	const topWords = getTopWordsByMood(wordCounts, topN);

	const data = topWords.map(({ word, counts }) => ({
		word,
		moods: Object.keys(counts).map((mood) => ({
			mood,
			count: counts[mood] || 0,
		})),
	}));

	return data;
};

export {
	preprocessText,
	countWordFrequencies,
	getTopWordsByMood,
	prepareHeatMapData,
};
