import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
	heading: string;
	content: string;
	imageSrc: string;
	fill: string;
	alt: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	heading,
	content,
	imageSrc,
	alt,
	fill,
}) => {
	return (
		<div className='flex flex-col justify-start gap-2 '>
			<div className='flex flex-row items-center gap-2'>
				<div
					className='max-w-[2rem] rounded-full p-1'
					style={{ backgroundColor: fill }}
				>
					{' '}
					<Image src={imageSrc} alt={alt} width={24} height={24} />
				</div>
				<span className='text-lg font-semibold sm:text-xl'>{heading}</span>
			</div>
			<span className='text-sm font-normal md:text-base'>{content}</span>
		</div>
	);
};

export default FeatureCard;
