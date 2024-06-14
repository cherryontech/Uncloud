import React from 'react';
import { Button } from './Button';
import { Heading } from './Heading';
import { Icon } from './Icons';
import { CloudSun } from '@phosphor-icons/react';
import Image from 'next/image';

interface ConfirmationMessageProps {
	userDisplayName: string;
	hideConfirmationMessage: () => void;
}


export const ConfirmationMessage = ({
	userDisplayName,
	hideConfirmationMessage,
}: ConfirmationMessageProps) => (
	<>
		<div className='fixed inset-0 z-20 bg-black opacity-50'></div>
		<div className='absolute left-1/2 top-1/2 z-30 flex h-[45rem] w-[33rem] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-14 rounded-md  bg-white p-12 ring-2 ring-gray-400 ring-opacity-20 ring-offset-2'>
			<div className='flex flex-col items-center gap-8'>
				<div className='flex w-[23rem] flex-col items-center justify-center gap-6'>
					<Image
						src='/Uncloud_Logo_1.svg'
						alt='My SVG Image'
						width={80}
						height={80}
						
					/>
					<div className='flex flex-col items-center justify-center gap-2'>
						<h4 className='text-center'>Welcome in {userDisplayName}!</h4>
						<span className='text-center text-base'>
							You can now start logging your reflections. Let’s get started with
							your first one!
						</span>
					</div>
				</div>
				<div className='h-[0.0625rem] w-[27rem] bg-[#D9D9D9]'></div>
				<div className='flex w-[23rem] flex-col items-center justify-center gap-6'>
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
	</>
);
