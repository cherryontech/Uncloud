import Image from 'next/image';
import React from 'react';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';

type Props = {
	count: number;
	percentage: number;
	isNegative: boolean;
	icon: string;
	growthArrow: React.JSX.Element;
};

const PercentageCard = ({ count, isNegative, percentage, icon, growthArrow }: Props) => {
	return (
		<div className='w-full rounded-2xl bg-white px-10 py-4 shadow-xl'>
			<div className='flex mb-1 w-full flex-row items-center justify-between'>
				<Image src={icon} alt='icon' width={40} height={40} />
				{growthArrow}
			</div>
			<div className='flex flex-row items-center gap-1'>
				<p className='text-xl font-bold'>{count}</p>
				<div>
					{isNegative ? (
						<IoIosArrowRoundDown size={16} color='#D40C0C' />
					) : (
						<IoIosArrowRoundUp size={16} color='#46FF59' />
					)}
				</div>
				<p className='text-xs text-gray-600'  >{percentage}%</p>
			</div>
			<p className='text-sm text-gray-400'>safa asf</p>
		</div>
	);
};

export default PercentageCard;
