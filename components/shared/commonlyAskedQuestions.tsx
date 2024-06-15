// commonlyAskedQuestions.tsx
import React from 'react';
import FAQCard from './FAQCard';

const commonlyAskedQuestionsData = [
	{
		question: 'What is Uncloud?',
		answer:
			'UnCloud is a free mood-tracking platform that uses weather to help career seekers navigate their professional journeys by understanding and reflecting on their emotions. You can create a record of your day, including your mood, wins, and thoughts.',
	},
	{
		question: 'How does Uncloud work?',
		answer: (
			<>
				Whether you&apos;re a career switcher or looking to advance in your
				current role, we know the job process can feel unpredictable and leave
				you feeling lost or stuck. Uncloud is here to help you track your mood
				and gain insights along the way:
				<ol className='list-inside list-decimal py-4 pl-4 leading-relaxed'>
					<li>Log in or select ‘Get started’ to create your account</li>
					<li>On your dashboard, click ‘Add a log’</li>
					<li>
						Choose a mood weather that best matches how you’re feeling that day,
						then click continue
					</li>
					<li>
						Optionally, enter up to 3 wins for the day and/or select from the
						guided reflection prompts to share your thoughts, or you can skip
						these steps
					</li>
					<li>
						Click ‘Done’ once you&apos;re finished for the reflection to be
						saved
					</li>
					<li>
						View the Trends page to gain valuable insights into your journey
					</li>
				</ol>
				Start using Uncloud today to gain clarity and navigate your professional
				journey with ease!
			</>
		),
	},
	{
		question: 'Why should I use a reflection journal?',
		answer:
			'Reflection journaling is a powerful tool to help you gain clarity, understand your emotions, and track your progress. It’s like having a personal guide that helps you navigate your thoughts and experiences, leading you toward defining your goals and personal growth. Give it a try—you might be surprised by the insights you uncover!',
	},
	{
		question: 'How often should I track my mood?',
		answer:
			'At Uncloud, we encourage you to track your mood daily. This helps provide the most accurate clarity on your growth and offers the best insights into your mood trends.',
	},
	{
		question: 'What are trends?',
		answer:
			'Trends provide an insightful overview of your activities, including completed logs, mood charts, frequently used words, and more! Sign up and start logging your reflections to see how this insightful tool can help you track your journey in real time.',
	},
	{
		question: 'Are my reflection logs saved?',
		answer:
			'Absolutely! Once you create your Uncloud account, all your logs are saved. You can easily access them by selecting a previous date on your calendar or filtering by a specific mood on the summary page in your dashboard.',
	},
	{
		question: 'Why does Uncloud use weather as a career metaphor?',
		answer:
			'Uncloud uses weather as a career metaphor because it beautifully illustrates the ups and downs of professional journeys. Just like the weather, your career will have sunny days filled with success and confidence, as well as stormy periods marked by challenges and disheartening. This metaphor helps you visualize and understand the ever-changing landscape of your career, emphasizing the importance of adaptability, resilience, and reflection as you navigate through various phases and conditions.',
	},
];

const CommonlyAskedQuestions: React.FC = () => {
	return (
		<div className='space-y-4'>
			{commonlyAskedQuestionsData.map((faq, index) => (
				<FAQCard key={index} question={faq.question} answer={faq.answer} />
			))}
		</div>
	);
};

export default CommonlyAskedQuestions;
