// FeatureCard.tsx
import React from 'react';
import Image from 'next/image';

interface MainFeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	imageSrc: string;
	imageAlt: string;
}

const MainFeatureCard: React.FC<MainFeatureCardProps> = ({
	icon,
	title,
	description,
	imageSrc,
	imageAlt,
}) => {
	return (
		<div className='flex w-full flex-col gap-12 rounded-[1.25rem] bg-[#F6F5F4] px-[1.5rem] pt-[1.75rem]'>
			<div className='flex w-full flex-col items-start gap-8 pr-[4rem]'>
				<div className='max-h-12 max-w-12'>{icon}</div>
				<span className='text-2xl font-semibold'>{title}</span>
				<span className='text-base font-normal text-[#706F6F]'>
					{description}
				</span>
			</div>
			<div className='relative flex h-full w-full items-end justify-end'>
				<div className='relative flex items-end justify-end'>
					<div style={{ width: '100%', height: 'auto' }}>
						<Image
							src={imageSrc}
							alt={imageAlt}
							layout='responsive' // This prop makes the image responsive
							width={2424}
							height={1964}
							priority // Ensures this image is prioritized in Next.js
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainFeatureCard;
