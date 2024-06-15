import React from 'react';
import Image from 'next/image';

interface QuoteCardProps {
	quote: string;
	author: string;
	role: string;
	imageSrc: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
	quote,
	author,
	role,
	imageSrc,
}) => {
	return (
		<div className='quote-box flex w-full flex-col justify-between gap-[0.8rem] rounded-xl bg-white p-[1.875rem] shadow-[0_14px_34px_0_rgba(0,0,0,0.05)]'>
			<span className='text-base font-semibold'>{quote}</span>
			<div className='quote-author flex flex-row items-center gap-2'>
				<div className='h-[4.275rem] w-[4.375rem] rounded-full'>
					<Image
						src={imageSrc}
						alt='First user testimonial'
						width={158}
						height={106}
						style={{ borderRadius: '50%' }}
					/>
				</div>

				<div className='flex flex-col'>
					<span className='text-base font-bold text-[#2D81E0]'>{author}</span>
					<span className='text-[0.8125rem] font-normal'>{role}</span>
				</div>
			</div>
		</div>
	);
};

export default QuoteCard;
