import React, { useEffect } from 'react';
import '/app/styles/landing.css';
import { useRouter } from 'next/navigation';
import { Button } from '@/stories/Button';
import Image from 'next/image';
import QuoteCard from '@/components/shared/quoteCard';
import {
	Calendar,
	Target,
	ChartBar,
	Heart,
	Lightbulb,
	FilmScript,
} from '@phosphor-icons/react';

const Landing: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('in-view');
					} else {
						entry.target.classList.remove('in-view');
					}
				});
			},
			{
				threshold: 0.1, // Adjust this threshold as needed
			}
		);

		const elements = document.querySelectorAll('.scroll-transition');
		elements.forEach((element) => {
			observer.observe(element);
		});

		// Cleanup observer on component unmount
		return () => {
			elements.forEach((element) => {
				observer.unobserve(element);
			});
		};
	}, []);

	return (
		<div className='landingContainer'>
			<div className='svgBackground'></div>
			<div className='landing-content flex w-full flex-col items-center justify-center'>
				{/* Your content goes here */}
				<div className='scroll-transition'>
					<div className='flex flex-col items-center justify-center gap-12 pt-8'>
						<div className='flex flex-col items-center justify-center gap-3'>
							<span className='max-w-[41rem] text-center text-[3.5rem] font-bold'>
								Track Mood, Reflect, Find Career Fulfillment
							</span>
							<span className='font-semibolds max-w-[27rem] text-center text-2xl'>
								Unleash the power of your emotions to chart a fulfilling career
								path
							</span>
						</div>
						<div className='flex h-full flex-row items-center gap-3'>
							<div className='max-w-[10rem]'>
								<Button
									primary={true}
									onClick={() => router.push('/auth/signUp')}
									label='Get started'
								/>
							</div>
							<div>
								<a
									className='h-full w-fit flex-shrink-0 px-6 py-[0.625rem] text-center text-sm font-bold leading-6 text-[#2D81E0]'
									href={'/auth/login'}
								>
									Log in
								</a>
							</div>
						</div>
					</div>
					<div className='flex w-full items-center justify-center p-16'>
						<div className='max-w-[62.5rem] overflow-hidden rounded-2xl shadow-[0_15px_20px_0_rgba(0,0,0,0.1)]'>
							<Image
								src='/landing1.png'
								alt='Uncloud Preview 1'
								width={5760}
								height={4096}
							/>
						</div>
					</div>
				</div>
				{/* App Features Cards */}
				<div className='scroll-transition flex max-w-[64.375rem] flex-row gap-20 px-8'>
					<div className='flex flex-col justify-start gap-2 '>
						<div className='flex flex-row items-center gap-2'>
							<div className='max-w-[2rem] p-1'>
								<Image
									src='/icons/Cloud.svg'
									alt='Cloud'
									width={24}
									height={24}
								/>
							</div>
							<span className='text-lg font-semibold sm:text-xl'>
								Track Your Mood
							</span>
						</div>
						<span className='text-sm font-normal md:text-base'>
							Easily record your daily work mood using our user-friendly mood
							logging page.
						</span>
					</div>
					<div className='flex flex-col justify-start gap-2'>
						<div className='flex flex-row items-center gap-2'>
							<div className='max-w-[2rem] p-1'>
								<Image
									src='/icons/Confetti.svg'
									alt='Confetti'
									width={24}
									height={24}
								/>
							</div>
							<span className='text-lg font-semibold md:text-xl'>
								Mood-matched prompts
							</span>
						</div>
						<span className='text-sm font-normal md:text-base'>
							Based on your selected mood, our platform pulls from a curated
							library of emotion-specific reflection prompts.
						</span>
					</div>
					<div className='flex flex-col justify-start gap-2'>
						<div className='flex flex-row items-center gap-2'>
							<div className='max-w-[2rem] p-1'>
								<Image
									src='/icons/PencilSimpleLine.svg'
									alt='Pencil'
									width={24}
									height={24}
								/>
							</div>
							<span className='text-lg font-semibold md:text-xl'>
								Dig Deeper
							</span>
						</div>
						<span className='text-sm font-normal md:text-base'>
							Answer additional follow-up prompts to explore the link between
							your mood and career goals.
						</span>
					</div>
				</div>
				{/* Carousel */}
				<div className='carousel-1 scroll-transition flex flex-col items-center justify-center gap-12'>
					{/* Carousel Menu*/}
					<div className='flex flex-row gap-12 pt-[7.56rem]'>
						<div className='carousel-option flex flex-col items-center justify-center gap-2 hover:cursor-pointer hover:text-[#2D81E0] active:text-[#2c2c2c]'>
							<div className='icon h-12 w-12'>
								<Calendar style={{ height: '3rem', width: '3rem' }} />
							</div>
							<span className='icon-label text-center text-2xl font-semibold  text-[#706F6F]'>
								Calendar
							</span>
						</div>
						<div className='carousel-option flex flex-col items-center justify-center gap-2 hover:cursor-pointer hover:text-[#2D81E0] active:text-[#2c2c2c]'>
							<div className='icon h-12 w-12'>
								<Target style={{ height: '3rem', width: '3rem' }} />
							</div>
							<span className='icon-label text-center text-2xl font-semibold  text-[#706F6F]'>
								Goal
							</span>
						</div>
						<div className='carousel-option flex flex-col items-center justify-center gap-2 hover:cursor-pointer hover:text-[#2D81E0] active:text-[#2c2c2c]'>
							<div className='icon h-12 w-12'>
								<ChartBar style={{ height: '3rem', width: '3rem' }} />
							</div>
							<span className='icon-label text-center text-2xl font-semibold  text-[#706F6F]'>
								Trends
							</span>
						</div>
						<div className='carousel-option flex flex-col items-center justify-center gap-2 hover:cursor-pointer hover:text-[#2D81E0] active:text-[#2c2c2c]'>
							<div className='icon h-12 w-12'>
								<Heart style={{ height: '3rem', width: '3rem' }} />
							</div>
							<span className='icon-label text-center text-2xl font-semibold  text-[#706F6F]'>
								Favorites
							</span>
						</div>
					</div>
					<div>
						<span className='text-base font-semibold'>
							Easily keep track of your moods and translate them to career
							success
						</span>
					</div>
					{/* Carousel Content */}
					<div className='flex w-full items-center justify-center p-16 pt-0 '>
						<div className='max-w-[62.5rem] overflow-hidden rounded-2xl shadow-[0_15px_20px_0_rgba(0,0,0,0.1)]'>
							<Image
								src='/landing1.png'
								alt='Uncloud Preview 1'
								width={5760}
								height={4096}
							/>
						</div>
					</div>
				</div>
				{/* Marketing Quote */}
				<div className='scroll-transition flex flex-col items-center justify-center gap-2 pt-[9.61rem]'>
					<span className='text-[2.8125rem] font-normal italic'>
						&quot;Goodbye generic, hello clarity! Love this website.&quot;
					</span>
					<span className='text-2xl font-semibold'>Sarah J., Marketing</span>
				</div>
				{/* Reflections Overview */}
				<div className='scroll-transition flex flex-col items-start pt-[9rem]'>
					<div className='flex flex-row items-center gap-2'>
						<div className='max-h-[11.1875rem] max-w-[11.75rem]'>
							<Image
								src='/landing/sun.png'
								alt='sun'
								width={188}
								height={179}
							/>
						</div>
						<span className='text-[3rem] font-semibold'>
							Unlock Career Clarity
						</span>
					</div>
					<div className='flex flex-col gap-8'>
						<div className='flex flex-col items-start gap-12 rounded-[1.25rem] bg-[#f6f5f4] px-20 py-12 '>
							<div className='flex max-w-[41.625rem] flex-col items-start gap-8'>
								<div className='max-h-12 max-w-12'>
									<Lightbulb
										style={{ height: '3rem', width: '3rem' }}
										color='#2D81E0'
									/>
								</div>
								<div className='flex flex-col gap-3'>
									<span className='text-2xl font-semibold'>
										Empowered Reflection: Personalized Prompts For You
									</span>
									<span className='text-base font-normal text-[#706F6F]'>
										Feeling stuck in a career rut? Traditional reflection
										prompts can be generic and leave you scratching your head.
										Our app goes beyond basic journaling by offering
										personalized career reflection prompts tailored specifically
										to your mood.
									</span>
								</div>
							</div>

							<div className='flex w-full items-center justify-center '>
								<div className='max-w-[62.5rem] overflow-hidden rounded-2xl shadow-[0_15px_20px_0_rgba(0,0,0,0.1)]'>
									<Image
										src='/landing1.png'
										alt='Uncloud Preview 1'
										width={5760}
										height={4096}
									/>
								</div>
							</div>
							<div className='flex w-full justify-center'>
								<div className='carousel-buttons flex flex-row items-center justify-center gap-2 '>
									<button className='carousel-button'>Log mood</button>
									<button className='carousel-button'>Wins of the day</button>
									<button className='carousel-button'>Reflection</button>
									<button className='carousel-button'>Prompt change</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='scroll-transition pt-[9rem]'>
					<div className='grid grid-cols-2 gap-8'>
						<div className='flex h-[49rem] w-full flex-col gap-12 rounded-[1.25rem] bg-[#F6F5F4] pl-[1.5rem] pt-[1.75rem]'>
							<div className='flex max-w-[32.3rem] flex-col items-start gap-8 pr-[1.5rem]'>
								<div className='max-h-12 max-w-12'>
									<Lightbulb
										style={{ height: '3rem', width: '3rem' }}
										color='#2D81E0'
									/>
								</div>
								<span className='text-2xl font-semibold'>Summary page</span>
								<span className='text-base font-normal text-[#706F6F]'>
									Feeling stuck in a career rut? Traditional reflection prompts
									can be generic and leave you scratching your head. Our app
									goes beyond basic journaling by offering personalized career
									reflection prompts tailored specifically to your mood.
								</span>
							</div>
							<div className=' flex h-full w-full bg-gray-500'>
								Image placeholder
							</div>
						</div>
						<div className='flex h-[49rem] w-full flex-col gap-12 rounded-[1.25rem] bg-[#F6F5F4] pl-[1.5rem] pt-[1.75rem]'>
							<div className='flex max-w-[32.3rem] flex-col items-start gap-8 pr-[1.5rem]'>
								<div className='max-h-12 max-w-12'>
									<FilmScript
										style={{ height: '3rem', width: '3rem' }}
										color='#2D81E0'
									/>
								</div>
								<span className='text-2xl font-semibold'>Daily page</span>
								<span className='text-base font-normal text-[#706F6F]'>
									Feeling stuck in a career rut? Traditional reflection prompts
									can be generic and leave you scratching your head. Our app
									goes beyond basic journaling by offering personalized career
									reflection prompts tailored specifically to your mood.
								</span>
							</div>
							<div className=' flex h-full w-full bg-gray-500'>
								Image placeholder
							</div>
						</div>
					</div>
				</div>
				{/* Customer Testimonials */}
				<div className='scroll-transition pt-[9rem]'>
					<div className='flex flex-col gap-[3.95rem] '>
						<span className='w-full text-center text-[3rem] font-semibold text-black'>
							Our Customers say it best.
						</span>
						<div className='customer-quotes flex items-center justify-center sm:relative sm:h-[25.125rem] sm:max-w-[83rem]'>
							<div className='quotes-grid  grid grid-cols-1 justify-items-center gap-4 px-4 sm:grid-cols-3'>
								<QuoteCard
									quote="“I used to just go through the motions at work.  The personalized prompts in this app made me reflect on what truly matters to me in a career. Now, I'm excited to take the next step!”"
									author='Joew Harbert'
									role='CEO, NoonBrew'
									imageSrc='/landing/testimonial_user1.png'
								/>
								<QuoteCard
									quote='“This app has been a game-changer! The personalized reflection prompts helped me connect my emotions to my career goals. Now I feel empowered to pursue a path that truly fulfills me.”'
									author='Mila McSabbu'
									role='Marketing & Office Coordinator'
									imageSrc='/landing/testimonial_user2.png'
								/>
								<QuoteCard
									quote="“My mood swings used to confuse me. Now, the app's prompts connect them to my career goals. Feeling empowered!”"
									author='Robert Fox'
									role='Owner, Beards of Brothers'
									imageSrc='/landing/testimonial_user3.png'
								/>
							</div>
							<div className='blue-rectangle' />
						</div>
					</div>
				</div>
				{/* Get Started */}
				<div className='scroll-transition'>
					<div className='flex flex-col items-center justify-center gap-[3.95rem] pt-[11rem]'>
						<span className='w-full text-center text-[3rem] font-semibold text-black'>
							Get started today
						</span>
						<div className='flex h-full flex-row items-center gap-3'>
							<div className='max-w-[10rem]'>
								<Button
									primary={true}
									onClick={() => router.push('/auth/signUp')}
									label='Get started'
								/>
							</div>
							<div>
								<a
									className='h-full w-fit flex-shrink-0 px-6 py-[0.625rem] text-center text-sm font-bold leading-6 text-[#2D81E0]'
									href={'/auth/login'}
								>
									Log in
								</a>
							</div>
						</div>
					</div>
					{/* Footer Image */}
					<div className='max-w-[84rem]'>
						<Image
							src='/landing/footer.png'
							alt='Footer Image'
							width={1337}
							height={752}
						/>
					</div>
				</div>
			</div>
			<div className='footer'>
				<p className='px-[3.5rem]'>
					© CherryOnTech Jupiter Jumpers | All Rights Reserved.
				</p>
			</div>{' '}
		</div>
	);
};

export default Landing;
