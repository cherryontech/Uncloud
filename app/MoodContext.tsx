// MoodContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type MoodEntry = {
	date: string;
	mood: string;
};

type MoodContextType = {
	moods: { [key: string]: string };
	addMood: (date: string, mood: string) => void;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: ReactNode }) => {
	const [moods, setMoods] = useState<{ [key: string]: string }>({});

	const addMood = (date: string, mood: string) => {
		setMoods((prev) => ({ ...prev, [date]: mood }));
	};

	return (
		<MoodContext.Provider value={{ moods, addMood }}>
			{children}
		</MoodContext.Provider>
	);
};

export const useMood = () => {
	const context = useContext(MoodContext);
	if (!context) {
		throw new Error('useMood must be used within a MoodProvider');
	}
	return context;
};
