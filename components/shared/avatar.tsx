import React from 'react';
import Image from 'next/legacy/image';

type Props = {
	image?:  string | null;
	size?: number;
};

const Avatar: React.FC<Props> = ({
	// src = './moods/sunny.svg',
	image = '/profileIcon.jpg',
	size = '2rem',
}) => (
	<div
		className='relative shrink-0 grow-0 rounded-full bg-white'
		style={{ width: size, height: size }}
	>
		<Image
			src={image || '/profileIcon.jpg'}
			alt='User Avatar'
		width={100}
		height={100}
		objectFit='cover'
		
			className='avatar w-full h-full object-cover rounded-full'
		/>
	</div>
);

export default Avatar;
