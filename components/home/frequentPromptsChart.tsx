import React from 'react';
import { MoodType } from '../pages/trends';

interface FrequentReflectionPromptsProps {
	prompts: {
		mood: MoodType;
		prompt: string;
		count: number;
	}[];
}

const moodColors = {
	Rainbow: { light: '#FDECF4', dark: '#F9C7D7' },
	Sunny: { light: '#FFFAEB', dark: '#FFE773 ' },
	Cloudy: { light: '#E7FAF3', dark: '#B1D5D5' },
	Stormy: { light: '#F2E6FF', dark: '#AA52BF' },
	Rainy: { light: '#EAF6FF', dark: '#A0D1F9' },
};

const FrequentReflectionPrompts: React.FC<FrequentReflectionPromptsProps> = ({
	prompts,
}) => {
	return (
		<div className='flex w-full flex-col gap-3'>
			{prompts.map((item, index) => (
				<div
					key={index}
					className='flex items-center justify-between gap-4 rounded-lg px-6 py-4'
					style={{ backgroundColor: moodColors[item.mood].light }}
				>
					<div className='flex items-center gap-4 text-base font-semibold leading-6 tracking-[-0.022rem]'>
						<span
							style={{ backgroundColor: moodColors[item.mood].dark }}
							className='flex h-6 w-6 items-center justify-center rounded-full p-2 text-white'
						>
							{index + 1}
						</span>
						<span className=''>{item.prompt}</span>
					</div>
					<div
						style={{ backgroundColor: moodColors[item.mood].dark }}
						className='flex min-h-8 items-center justify-center rounded-full bg-white px-4 py-0 text-white '
					>
						<span className='min-h-[1.5rem] whitespace-nowrap text-sm font-semibold leading-6'>
							{item.count} reflections
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default FrequentReflectionPrompts;
