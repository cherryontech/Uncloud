import React from 'react';

interface TrackerProps {
	totalSteps: number;
	currentStep: number;
}

export const ProgressTracker = ({ totalSteps, currentStep }: TrackerProps) => {
	return (
		// Creates a div with totalSteps number of divs inside it, and div number currentStep is styled differently
		<div className='flex w-full justify-between gap-2'>
			{Array.from({ length: totalSteps }).map((_, index) => (
				<div
					key={index}
					className={[
						'full h-2 w-20 rounded-lg',
						index === currentStep - 1 ? 'bg-primary' : 'bg-gray-300',
					].join(' ')}
				></div>
			))}
		</div>
	);
};
export default ProgressTracker;
