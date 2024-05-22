// LogSummary.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
	formatDateToMonthDayYear,
	formatValueTypeToYYYYMMDD,
} from '../utils/reusableFunctions';
import { CaretLeft, Plus, Minus } from '@phosphor-icons/react';
import { ReflectionsType } from '../home/newLogPopup';
import { useAuth } from '@/app/context/UserProvider';
import { getUser } from '../utils/serverFunctions';

interface LogSummaryProps {
	log: {
		date: Date;
		mood: string;
		icon: string;
		reflections: ReflectionsType[];
	};
	handleGoBack: () => void;
}

const LogSummary: React.FC<LogSummaryProps> = ({ log, handleGoBack }) => {
	const moodNames = {
		Rainbow: 'Proud',
		Sunny: 'Confident',
		Cloudy: 'Uncertain',
		Rainy: 'Disappointed',
		Stormy: 'Stressed',
	};
	const { user, isUpdated } = useAuth();

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

	const [openReflections, setOpenReflections] = useState<number[]>([]);
	const [initialReflections, setInitialReflections] = useState<
		ReflectionsType[]
	>([]);
	console.log(isUpdated);

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
						<button
							onClick={handleGoBack}
							className='flex flex-row items-center justify-center gap-2'
						>
							<CaretLeft size={16} weight='bold' />
							<span className='flex min-h-12 w-fit items-center justify-center py-1 text-base'>
								{/* {formatDateToMonthDayYear(log.date)} */}
								Back to Summary
							</span>
						</button>
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
				{log.reflections.length > 0 ? (
					<div className='flex flex-col gap-3'>
						<div className='flex flex-row items-center justify-start  gap-2 text-sm'>
							<span className='font-semibold'>Reflections</span>
							<span className='text-[#706F6F]'>({log.reflections.length})</span>
						</div>
						{/* render a div for every item in reflections */}

						{log.reflections.map((reflection, index) => (
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
				) : (
					<div className='flex w-full flex-col items-center justify-center'>
						<p className='text-base font-medium text-black'>
							No Reflections yet
						</p>
					</div>
				)}
			</div>
		</>
	);
};

export default LogSummary;
