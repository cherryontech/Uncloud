import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '/app/styles/carousel.css';

interface CarouselItem {
	title: string;
	description: string;
	imageSrc: string;
	imageAlt: string;
}

const carouselItems: CarouselItem[] = [
	{
		title: 'Log mood',
		description:
			'Easily record your daily work mood using our user-friendly mood logging page.',
		imageSrc: '/landing/Carousel_LogMood.png',
		imageAlt: 'Uncloud Reflection Interface Preview',
	},
	{
		title: 'Wins of the day',
		description:
			'Reflect on your daily achievements and keep track of your progress.',
		imageSrc: '/landing/Carousel_Wins.png',
		imageAlt: 'Wins of the Day Preview',
	},
	{
		title: 'Reflection',
		description:
			'Answer additional follow-up prompts to explore the link between your mood and career goals.',
		imageSrc: '/landing/Carousel_Reflection.png',
		imageAlt: 'Reflection Interface Preview',
	},
	{
		title: 'Prompt change',
		description:
			'Get personalized career reflection prompts tailored specifically to your mood.',
		imageSrc: '/landing/Carousel_PromptChange.png',
		imageAlt: 'Prompt Change Preview',
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
		</>
	);
};

export default Carousel;
