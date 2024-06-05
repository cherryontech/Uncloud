import React from 'react';
import '/app/styles/loadingSpinner.css';
import Image from 'next/image';

const LoadingSpinner = () => {
	return (
		<div className='fixed inset-0 z-50 mt-[-20px] flex flex-col items-center justify-center bg-[#F3F5F9]'>
			<Image
				src='Uncloud_Logo_2.svg'
				alt='Logo'
				className='logo'
				width={123}
				height={58}
			/>
			<div className='loader'></div>
		</div>
	);
};

export default LoadingSpinner;
