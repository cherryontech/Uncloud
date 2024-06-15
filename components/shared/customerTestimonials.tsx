// CustomerTestimonials.tsx
import React from 'react';
import Image from 'next/image';
import QuoteCard from '@/components/shared/quoteCard';

const CustomerTestimonials: React.FC = () => {
	return (
		<div className='customer-quotes flex items-center justify-center rounded-xl bg-[#F6F5F4] sm:relative'>
			<div className='quotes-grid  s:grid-rows-2 grid grid-cols-1 justify-items-center gap-8 px-[3.25rem] py-[6rem] sm:grid-cols-3'>
				<QuoteCard
					quote='“Uncloud has been a game-changer in helping me track my career progress and emotions. The weather metaphor makes it so intuitive and easy to use. I highly recommend it to anyone feeling stuck in their career!”'
					author='Emily Watson'
					role='Marketing Manager at BrightWave'
					imageSrc='/landing/testimonial_user2.png'
				/>
				<QuoteCard
					quote="“Using Uncloud has given me valuable insights into my professional journey. It's amazing how something as simple as logging my mood daily can provide such clarity and motivation.”"
					author='Jake Thompson'
					role='Software Developer at TechSolutions'
					imageSrc='/landing/testimonial_user1.png'
				/>
				<QuoteCard
					quote="“My mood swings used to confuse me. Now, the app's prompts connect them to my career goals. Feeling empowered!”"
					author='Robert Fox'
					role='Owner, Beards of Brothers'
					imageSrc='/landing/testimonial_user3.png'
				/>
				<QuoteCard
					quote='“As a career coach, I recommend Uncloud to all my clients. It helps them reflect on their day-to-day experiences and track their emotional progress, making it an essential tool for personal growth.”'
					author='Sara Lee'
					role='Founder at CareetBoost Coaching'
					imageSrc='/landing/testimonial_user2.png'
				/>
				<QuoteCard
					quote="“Uncloud's mood tracking and reflection prompts have been incredibly beneficial in my career transition. It has helped me stay grounded and focused on my goals.”"
					author='David Ramirez'
					role='Career Switcher'
					imageSrc='/landing/testimonial_user1.png'
				/>
				<QuoteCard
					quote="“The Trends page on Uncloud offers a comprehensive overview of my mood and progress over time. It's an excellent tool for anyone looking to gain a deeper understanding of their professional journey.”"
					author='Lisa Martin'
					role='Project Manager at GreenTech'
					imageSrc='/landing/testimonial_user2.png'
				/>
			</div>
		</div>
	);
};

export default CustomerTestimonials;
