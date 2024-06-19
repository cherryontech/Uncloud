import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lightbulb } from '@phosphor-icons/react';
import '/app/styles/carousel.css';

interface CarouselItem {
	title: string;
	description: string;
	imageSrc: string;
	imageAlt: string;
	heading: string;
	content: string;
}

const carouselItems: CarouselItem[] = [
	{
		title: 'Log mood',
		description:
			'Easily record your daily work mood using our user-friendly mood logging page.',
		imageSrc: '/landing/Carousel_LogMood.png',
		imageAlt: 'Uncloud Reflection Interface Preview',
		heading: 'Capture Your Emotions: Reflect and Grow',
		content:
			'Need help to make sense of your daily ups and downs? Our app helps you track your feelings, offering insightful prompts that turn your reflections into a powerful tool for personal growth. Dive into your emotional journey and see how capturing your moods can lead to a more fulfilling career path.',
	},
	{
		title: 'Wins of the day',
		description:
			'Reflect on your daily achievements and keep track of your progress.',
		imageSrc: '/landing/Carousel_Wins.png',
		imageAlt: 'Wins of the Day Preview',
		heading: 'Celebrate Success: Highlight Your Daily Achievements',
		content:
			'Feeling like your hard work goes unnoticed? Our app lets you spotlight your daily wins, no matter how small, and helps you stay motivated. Celebrate your achievements each day and see how recognizing your successes can drive your career forward.',
	},
	{
		title: 'Reflection',
		description:
			'Answer additional follow-up prompts to explore the link between your mood and career goals.',
		imageSrc: '/landing/Carousel_Reflection.png',
		imageAlt: 'Reflection Interface Preview',
		heading: 'Empowered Reflection: Personalized Prompts for You',
		content:
			'Stuck in a career rut? Generic reflection prompts can be unhelpful and confusing. Our app takes it up a notch with personalized career reflection prompts designed to match your mood.',
	},
	{
		title: 'Prompt change',
		description:
			'Get personalized career reflection prompts tailored specifically to your mood.',
		imageSrc: '/landing/Carousel_PromptChange.png',
		imageAlt: 'Prompt Change Preview',
		heading: 'Refresh Prompts: Tailored Questions Just for You',
		content: `Tired of the same old questions that don't quite fit? Our app refreshes your prompts with tailored questions designed to resonate with your unique career journey. Get inspired and stay engaged with reflections that truly match where you are and where you're headed.`,
	},
];

const Carousel: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [direction, setDirection] = useState<'left' | 'right'>('right');
	const [transitionProperties, setTransitionProperties] = useState({
		duration: 0.5,
		distance: 100,
		easing: 'ease-in-out',
	});

	const handleButtonClick = (index: number) => {
		const distance = Math.abs(index - activeIndex);
		const newDuration = 0.5 + distance * 0.1;
		const newDistance = 100 + distance * 10;
		const newEasing =
			distance > 1 ? 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' : 'ease-in-out';

		setTransitionProperties({
			duration: newDuration,
			distance: newDistance,
			easing: newEasing,
		});

		setDirection(index > activeIndex ? 'right' : 'left');
		setActiveIndex(index);
	};

	useEffect(() => {
		const root = document.documentElement;
		root.style.setProperty(
			'--transition-duration',
			`${transitionProperties.duration}s`
		);
		root.style.setProperty(
			'--transition-distance',
			`${transitionProperties.distance}%`
		);
		root.style.setProperty('--transition-easing', transitionProperties.easing);
	}, [transitionProperties]);

	return (
		<>
			<div className='ml-[7.38rem] mr-[7.28rem] flex max-w-[45rem] flex-col items-start gap-8 '>
				<div className='max-h-12 max-w-12'>
					<Lightbulb
						style={{ height: '3rem', width: '3rem' }}
						color='#2D81E0'
					/>
				</div>
				<div className='flex flex-col gap-3'>
					<span className='text-2xl font-semibold'>
						{/* Dynamic Heading */}
						{carouselItems[activeIndex].heading}
					</span>
					<span className='min-h-[7rem] text-justify text-base font-normal text-[#706F6F]'>
						{/* Dynamic Content */}
						{carouselItems[activeIndex].content}
					</span>
				</div>
			</div>
			<div className='flex h-full w-full flex-col items-center justify-center gap-12'>
				<div className='carousel-container'>
					{carouselItems.map((item, index) => (
						<div
							key={index}
							className={`carousel-item ${
								index === activeIndex
									? 'active'
									: index < activeIndex
										? 'left'
										: 'right'
							}`}
						>
							<Image
								src={item.imageSrc}
								alt={item.imageAlt}
								layout='responsive'
								width={2424}
								height={1964}
								objectFit='contain'
								priority
								style={{ borderRadius: '1rem' }}
							/>
						</div>
					))}
				</div>

				<div className='carousel-buttons'>
					{carouselItems.map((item, index) => (
						<button
							key={index}
							className={`carousel-button ${activeIndex === index ? 'active' : ''}`}
							onClick={() => handleButtonClick(index)}
						>
							{item.title}
						</button>
					))}
				</div>
			</div>
		</>
	);
};

export default Carousel;
