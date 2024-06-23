import React, { useEffect } from 'react';
import '/app/styles/landing.css';
import { useRouter } from 'next/navigation';
import { Button } from '@/stories/Button';
import Image from 'next/image';
import QuoteCard from '@/components/shared/quoteCard';
import FeatureCard from '@/components/shared/landingFeaturesCard';
import CommonlyAskedQuestions from '@/components/shared/commonlyAskedQuestions';
import CustomerTestimonials from '@/components/shared/customerTestimonials';
import MainFeatureCard from '@/components/shared/featureCard';
import Carousel from '@/components/shared/carousel';
import Carousel2 from '@/components/shared/carousel2';
import { Lightbulb, FilmScript } from '@phosphor-icons/react';

const useIntersectionObserver = () => {
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
				threshold: 0.1,
			}
		);

		const elements = document.querySelectorAll('.scroll-transition');
		elements.forEach((element) => {
			observer.observe(element);
		});

		return () => {
			elements.forEach((element) => {
				observer.unobserve(element);
			});
		};
	}, []);
};

const Landing: React.FC = () => {
	const router = useRouter();
	useIntersectionObserver();

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
								priority
							/>
						</div>
					</div>
				</div>
				{/* App Features Cards */}
				<div className='scroll-transition flex max-w-[64.375rem] flex-row gap-20 px-8'>
					<FeatureCard
						heading='Track Your Mood'
						content='Easily record your daily work mood using our user-friendly mood logging page.'
						imageSrc='/icons/Cloud.svg'
						fill='#FAFCFF'
						alt='Cloud'
					/>
					<FeatureCard
						heading='Mood-matched prompts'
						content='Based on your selected mood, our platform pulls from a curated library of emotion-specific reflection prompts.'
						imageSrc='/icons/Confetti.svg'
						fill='#FFFAEB'
						alt='Confetti'
					/>
					<FeatureCard
						heading='Dig Deeper'
						content='Answer additional follow-up prompts to explore the link between your mood and career goals.'
						imageSrc='/icons/PencilSimpleLine.svg'
						fill='#F5FFFB'
						alt='Pencil'
					/>
				</div>
				{/* Carousel */}
				<div className='scroll-transition flex w-full flex-col items-center justify-center gap-12'>
					<Carousel2 />
				</div>
				{/* Marketing Quote */}
				<div className='scroll-transition flex flex-col items-center justify-center gap-2 pt-[9.61rem]'>
					<span className='text-center text-[2.8125rem] font-normal italic'>
						&quot;Goodbye generic, hello clarity! Love this website.&quot;
					</span>
					<span className='text-2xl font-semibold'>Sarah J., Marketing</span>
				</div>
				{/* Reflections Overview */}
				<div className='scroll-transition flex w-full flex-col  items-start pl-[6rem] pr-[6.5rem] pt-[9rem]'>
					<div className='flex w-full flex-row items-center gap-2 pb-2'>
						<div className='max-h-[11.1875rem] max-w-[11.75rem]'>
							<Image
								src='/moods/greyWithFace.svg'
								alt='sun'
								width={188}
								height={179}
								priority
							/>
						</div>
						<span className='text-[3rem] font-semibold'>
							Unlock Career Clarity
						</span>
					</div>
					<div className='flex w-full flex-col gap-8'>
						<div className='flex flex-col items-start gap-6 rounded-[1.25rem] bg-[#f6f5f4] py-12 '>
							<Carousel />
						</div>
					</div>
				</div>
				<div className='scroll-transition pl-[6rem] pr-[6.5rem] pt-[9rem]'>
					<div className='grid grid-cols-2 gap-8'>
						<MainFeatureCard
							icon={<Lightbulb style={{ height: '3rem', width: '3rem' }} />}
							title='Summary page'
							description='The Summary page allows you to see a history of your moods and reflections, and you can also filter this section by a specific mood to gain deeper insights and track your progress more effectively.'
							imageSrc='/landing/Preview_SummaryPage.png'
							imageAlt='Summary Page Preview'
						/>

						<MainFeatureCard
							icon={<FilmScript style={{ height: '3rem', width: '3rem' }} />}
							title='Daily page'
							description='On the Daily page, you can see your wins of the day and reflections in detail, providing a comprehensive overview of your achievements and thoughts. Additionally, you can favorite your reflections within the Daily page by selecting the desired reflection log.'
							imageSrc='/landing/Preview_DailyPage.png'
							imageAlt='Daily Page Preview'
						/>
					</div>
				</div>
				{/* Customer Testimonials */}
				{/* <div className='scroll-transition pl-[6rem] pr-[6.5rem] pt-[9rem]'>
					<div className='flex flex-col gap-8'>
						<div className='flex flex-col gap-8'>
							<div className='flex flex-col gap-8'>
								<span className='text-center text-[3rem] font-semibold text-black'>
									Join a global movement. <br></br>
									Unlock your career clarity.
								</span>
								<span className='text-center text-base font-semibold'>
									Our users say it best.
								</span>
							</div>
							<div className='pl-[6rem] pr-[6rem]'>
								<Image
									src='/landing/customers.png'
									alt='Customer Illustrations'
									width={4080}
									height={600}
								/>
							</div>
						</div>
						<CustomerTestimonials />
					</div>
				</div> */}
				{/* Common Questions */}
				<div className='scroll-transition w-full pl-[6rem] pr-[6.5rem] '>
					<div className='flex flex-col items-center justify-center gap-[5rem] pt-[11rem]'>
						<span className='w-full text-center text-[3rem] font-semibold text-black'>
							Commonly Asked Questions
						</span>
						<div className='w-full min-[420px]:w-[49.5rem]'>
							<CommonlyAskedQuestions />
						</div>
					</div>
				</div>
				{/* Get Started */}
				<div className='scroll-transition'>
					<div className='flex flex-col items-center justify-center gap-6 pt-[9rem]'>
						<span className='w-full text-center text-[3rem] font-semibold text-black'>
							Get started today
						</span>
						<div className='flex h-full flex-row items-center gap-3'>
							<div className='w-[10rem]'>
								<Button
									primary={true}
									onClick={() => router.push('/auth/signUp')}
									label='Get started'
								/>
							</div>
						</div>
					</div>
					{/* Footer Image */}
					<div className='max-w-[84rem]'>
						<Image
							src='/landing/Footer_Clouds.png'
							alt='Footer Image'
							width={1337}
							height={752}
						/>
					</div>
				</div>
			</div>
			<div className='footer mt-[9rem]'>
				<p className='px-[3.5rem]'>
					© CherryOnTech Jupiter Jumpers | All Rights Reserved.
				</p>
			</div>{' '}
		</div>
	);
};

export default Landing;
