import React from 'react';

type ProgressBarProps = {
	progress: number; // progress in percentage
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	return (
		<div
			style={{
				width: '100%',
				position: 'fixed',
				top: 0,
			}}
		>
			<div
				style={{
					height: '0.5rem',
					width: `${progress}%`,
					backgroundColor: '#2D81E0',
					borderRadius: '0 1rem 1rem 0',
				}}
			/>
		</div>
	);
};

export default ProgressBar;
