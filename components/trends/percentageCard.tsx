import Image from 'next/image';
import React from 'react';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';
import { ArrowDown, ArrowUp } from '@phosphor-icons/react';

type Props = {
	count: number;
	percentage: string;
	isNegative: boolean;
	icon: string;
	description: string;
	growthArrow: React.JSX.Element;
};

const PercentageCard = ({
	count,
	isNegative,
	percentage,
	icon,
	growthArrow,
	description,
}: Props) => {
	return (
		<div className='flex h-[10.25rem] w-full flex-col gap-3 rounded-2xl bg-white p-5 shadow-xl'>
			<div className='flex w-full flex-row items-center justify-between'>
				<div className='relative h-[3rem] w-[3rem]'>
					<Image src={icon} alt='icon' layout='fill' />
				</div>
				<div className='h-[3rem] w-[3rem]'> {growthArrow}</div>
			</div>
			<div className='flex flex-col'>
				<div className='flex flex-row items-center gap-2'>
					<span className='text-3xl font-bold'>{count}</span>
					<div className='flex h-full flex-row items-center justify-center gap-1'>
						<div className='flex h-5 w-5 items-center justify-center'>
							{isNegative ? (
								<ArrowDown className='h-full w-full' color='#D40C0C' />
							) : (
								<ArrowUp className='h-full w-full' color='#46FF59' />
							)}
						</div>
						<span className='text-sm font-semibold text-[#706F6F]'>
							{percentage}%
						</span>
					</div>
				</div>
				<p className='text-base font-semibold text-[#D9D9D9]'>{description}</p>
			</div>
		</div>
	);
};

export default PercentageCard;
