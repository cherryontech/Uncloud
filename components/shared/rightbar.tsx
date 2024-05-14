'use client';
import React from 'react';

type Props = {};

const Rightbar = (props: Props) => {
	return (
		<div className='flex h-full w-full flex-col gap-4 bg-[#F3F5F9] pb-6 pr-6'>
			<div className='flex h-full flex-col justify-start gap-2 rounded-2xl bg-white p-6'>
				<span className='h-fit text-base font-semibold'>Summary Page</span>
				<div className='h-full'>Links</div>
			</div>
		</div>
	);
};

export default Rightbar;
