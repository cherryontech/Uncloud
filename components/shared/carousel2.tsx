import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, ChartBar, Heart } from '@phosphor-icons/react';
import '/app/styles/carousel2.css';

const carouselOptions = [
	{
		icon: Calendar,
		label: 'Calendar',
		imageSrc: '/landing/scrum28.png',
		color: '#2D81E0',
	},
	{
		icon: ChartBar,
		label: 'Trends',
		imageSrc: '/landing/trends.png',
		color: '#AA52BF',
	},
	{
		icon: Heart,
		label: 'Favorites',
		imageSrc: '/landing/favorites.png',
		color: '#FF4682',
	},
];

const Carousel2: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [direction, setDirection] = useState<'left' | 'right'>('right');
	const [transitionProperties, setTransitionProperties] = useState({
		duration: 0.5,
		distance: 100,
		easing: 'ease-in-out',
	});

	const handleOptionClick = (index: number) => {
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
			<div className='carousel-menu flex flex-row gap-12 pt-[7.56rem]'>
				{carouselOptions.map((option, index) => {
					const IconComponent = option.icon;
					return (
						<button
							key={index}
							className={`carousel-option ${
								activeIndex === index ? 'active' : ''
							}`}
							onClick={() => handleOptionClick(index)}
							style={{
								color: activeIndex === index ? '#2C2C2C' : '#706f6f',
							}}
						>
							<div
								className='icon h-12 w-12'
								style={{
									color: activeIndex === index ? option.color : 'inherit',
								}}
							>
								<IconComponent
									style={{
										height: '3rem',
										width: '3rem',
										fill: activeIndex === index ? option.color : '#706f6f',
									}}
								/>
							</div>
							<span
								className='icon-label text-center text-2xl font-semibold'
								style={{
									color: activeIndex === index ? '#2C2C2C' : '#706f6f',
								}}
							>
								{option.label}
							</span>
						</button>
					);
				})}
			</div>
			<div>
				<span className='text-base font-semibold'>
					Easily keep track of your moods and translate them to career success
				</span>
			</div>
			<div className='flex w-full items-center justify-center pt-0'>
				<div className='image-container'>
					{carouselOptions.map((option, index) => (
						<div
							key={index}
							className={`carousel-image ${
								index === activeIndex
									? 'active'
									: index < activeIndex
										? 'left'
										: 'right'
							}`}
						>
							<Image
								src={option.imageSrc}
								alt={`${option.label} Preview`}
								layout='responsive'
								width={5760}
								height={4096}
								priority
								objectFit='contain'
							/>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Carousel2;
