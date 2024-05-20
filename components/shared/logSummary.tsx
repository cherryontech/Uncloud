// LogSummary.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { formatDateToMonthDayYear } from '../utils/reusableFunctions';
import { CaretLeft, Plus, Minus } from '@phosphor-icons/react';

interface LogSummaryProps {
	log: { date: Date; mood: string; icon: string };
	handleGoBack: () => void; // Add this line
}

const LogSummary: React.FC<LogSummaryProps> = ({ log, handleGoBack }) => {
	const moodNames = {
		Rainbow: 'Proud',
		Sunny: 'Confident',
		Cloudy: 'Uncertain',
		Rainy: 'Disappointed',
		Stormy: 'Stressed',
	};

	const wins = [
		{
			title: 'I made a resume today',
			description: 'I created a template and updated my job list',
		},
		{
			title: 'I read 3 chapters',
			description: 'I started reading a new job search book',
		},
		{ title: 'I updated my LinkedIn', description: 'I redid my coverpage' },
	];

	const reflections = [
		{
			question: 'How will my ideal career differ from my previous job?',
			answer: 'I want to work in a more collaborative environment',
		},
		{
			question: 'What are my top 3 skills?',
			answer: 'I am good at communication, problem-solving, and organization',
		},
		{
			question: 'What are my top 3 values?',
			answer: 'I value honesty, integrity, and respect',
		},
		{
			question: 'What are my top 3 interests?',
			answer: 'I am interested in technology, art, and music',
		},
	];

	const [openReflections, setOpenReflections] = useState<number[]>([]);

	const toggleReflection = (index: number) => {
		setOpenReflections((prevState) =>
			prevState.includes(index)
				? prevState.filter((i) => i !== index)
				: [...prevState, index]
		);
	};

	return (
		<>
			<div className='flex max-h-24 flex-col gap-5 pb-4'>
				<div className='flex w-full flex-row items-center justify-between  px-1 text-base font-semibold'>
					<div className='flex flex-row gap-2 text-primary'>
						<button onClick={handleGoBack}>
							<CaretLeft size={16} weight='bold' />
						</button>
						<span className='flex min-h-12 w-fit items-center justify-center py-1 text-base'>
							{formatDateToMonthDayYear(log.date)}
						</span>
					</div>
				</div>
				{/* Divider */}
				<div className='h-[0.125rem] bg-[#dee9f5]'></div>
			</div>
			<div className='flex h-full flex-col overflow-scroll'>
				{/* Icon and Mood Name */}
				<div className='flex flex-col items-center justify-center gap-4 py-10'>
					<div className='rounded-xl border border-[#DEE9F5] bg-[#FAFCFF]'>
						<Image src={log.icon} alt={log.mood} width={150} height={150} />
					</div>
					<div className='flex flex-col items-center justify-center'>
						<span className='text-2xl font-semibold'>{log.mood}</span>
						<span className='text-sm'>
							{moodNames[log.mood as keyof typeof moodNames]}
						</span>
					</div>
				</div>
				{/* Three Wins */}
				<div className='flex flex-col gap-3'>
					<span className='text-sm font-semibold'>3 Wins</span>
					<div>
						{wins.map((win, index) => (
							<div
								key={index}
								className='relative flex h-fit flex-row items-center justify-start gap-3'
							>
								<div className='absolute bottom-0 left-0 top-2 flex flex-col items-center gap-1'>
									<div className='h-2 w-2 rounded-full bg-primary'></div>
									{index !== wins.length - 1 && (
										<div className='w-[1px] flex-grow bg-[#DEE9F5]'></div>
									)}
								</div>
								<div className='ml-3 flex flex-col justify-start pb-8 pl-3'>
									<span className='text-sm font-semibold leading-6'>
										{win.title}
									</span>
									<span className='text-xs font-normal text-[#706F6F]'>
										{win.description}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
				{/* Reflections */}
				<div className='flex flex-col gap-3'>
					<div className='flex flex-row items-center justify-start  gap-2 text-sm'>
						<span className='font-semibold'>Reflections</span>
						<span className='text-[#706F6F]'>({reflections.length})</span>
					</div>
					{/* render a div for every item in reflections */}

					{reflections.map((reflection, index) => (
						<div
							key={index}
							className={`grid gap-x-5 px-4 py-2 ${openReflections.includes(index) ? 'question-opened grid-cols-[1fr_min-content] grid-rows-2 items-center' : 'question-closed grid-cols-[1fr_min-content] grid-rows-1 rounded-lg border border-[#DEE9F5] bg-[#FAFCFF]'}`}
						>
							<div
								className={`question-div flex flex-row items-center justify-between  text-sm text-[#706F6F] ${openReflections.includes(index) ? 'question-opened bg-white' : 'question-closed'}`}
								onClick={() => toggleReflection(index)}
							>
								<span className='font-semibold'>{reflection.question}</span>
							</div>
							<div
								className={`col-start-2 col-end-3 row-span-2 row-start-1 flex self-stretch justify-self-end ${openReflections.includes(index) ? 'question-opened items-start ' : 'question-closed items-center '}`}
								onClick={() => toggleReflection(index)}
							>
								{openReflections.includes(index) ? (
									<Minus
										size={16}
										weight='light'
										className='h-8 w-8 rounded-full bg-[#DEE9F5] px-1'
									/>
								) : (
									<Plus
										size={16}
										weight='light'
										className='h-8 w-8 rounded-full  px-1'
									/>
								)}
							</div>

							{openReflections.includes(index) && (
								<div className='answer-div col-start-1 col-end-2 row-start-2 row-end-3 mt-2 flex flex-col gap-2'>
									<div className='text-xs text-[#706F6F]'>
										{reflection.answer}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default LogSummary;
