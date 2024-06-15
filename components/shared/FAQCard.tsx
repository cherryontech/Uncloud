// FAQCard.tsx
import React, { useState } from 'react';
import { Minus, Plus } from '@phosphor-icons/react';

interface FAQCardProps {
	question: string;
	answer: React.ReactNode;
}

const FAQCard: React.FC<FAQCardProps> = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCard = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div
			className='my-2 cursor-pointer rounded-lg bg-[#F6F5F4] p-6'
			onClick={toggleCard}
		>
			<div className='flex items-center justify-between'>
				<h3 className='text-base font-semibold'>{question}</h3>
				<span className='text-xl'>{isOpen ? <Minus /> : <Plus />}</span>
			</div>
			{isOpen && (
				<div className='mt-[1.3rem] pr-8 text-base font-normal text-[#747474]'>
					{answer}
				</div>
			)}
		</div>
	);
};

export default FAQCard;
