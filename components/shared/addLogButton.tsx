// AddLogButton.tsx
import React from 'react';
import { Button } from '@/stories/Button';
import { Plus } from '@phosphor-icons/react';

type Props = {
	handleAddLogClick: () => void;
};

const AddLogButton = ({ handleAddLogClick }: Props) => {
	return (
		<Button
			type='button'
			label={
				<span
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '5px',
					}}
				>
					<Plus />
					<div className='flex content-center items-center justify-center'>
						Add Log
					</div>
				</span>
			}
			primary
			onClick={handleAddLogClick}
			version='primary'
		/>
	);
};

export default AddLogButton;
