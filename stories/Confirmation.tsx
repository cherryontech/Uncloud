import React from 'react';
import { Button } from './Button';
import { Heading } from './Heading';
import { Icon } from './Icons';
import { CloudSun } from '@phosphor-icons/react';

interface ConfirmationMessageProps {
	userDisplayName: string;
	hideConfirmationMessage: () => void;
}

console.log('Here?');
export const ConfirmationMessage = ({
	userDisplayName,
	hideConfirmationMessage,
}: ConfirmationMessageProps) => (
	<div className='absolute left-1/2 top-1/2 flex h-[45rem] w-[33rem] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-14 rounded-md  p-12 ring-2 ring-gray-400 ring-opacity-20 ring-offset-2'>
		<div className='flex flex-col items-center gap-8'>
			<div className='flex w-[23rem] flex-col items-center justify-center gap-6'>
				<Icon type='cloud-sun' size='6rem' weight='regular' />
				<div className='flex flex-col items-center justify-center gap-2'>
					<h4 className='text-center'>Welcome in {userDisplayName} </h4>
					<p className='text-center'>
						You can now start logging your reflections. Let’s get started with
						your first one!
					</p>
				</div>
			</div>
			<div>
				<hr className='h-0.25 bg-lineColor'></hr>
			</div>
			<div className='flex w-[23rem] flex-col items-center justify-center gap-4'>
				<div className='flex flex-row gap-4'>
					<Icon type='sun' size='2rem' weight='light' />
					<p>
						Select your current career emotion from the icons on our homepage.
					</p>
				</div>
				<div className='flex flex-row gap-4'>
					<Icon type='lightbulb-filament' size='2rem' weight='light' />
					<p>Explore prompts and content tailored to your chosen emotion.</p>
				</div>
				<div className='flex flex-row gap-4'>
					<Icon type='chart-line-up' size='2rem' weight='light' />
					<p>
						Gain clarity on your goals and identify areas for focus through
						these exercises.
					</p>
				</div>
			</div>
		</div>

		<Button
			onClick={hideConfirmationMessage}
			label='Get started'
			primary
			version='primary'
			size='medium'
		/>
	</div>
);
