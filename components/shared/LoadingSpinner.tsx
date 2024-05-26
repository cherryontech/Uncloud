import React from 'react';

const LoadingSpinner = () => {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
			<div className='loader'>Loading...</div>
		</div>
	);
};

export default LoadingSpinner;
