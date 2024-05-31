import React from 'react';
import Image from 'next/legacy/image';

type Props = {
	image?: string | null;
	size?: number;
};

const Avatar: React.FC<Props> = ({
	// src = './moods/sunny.svg',
	image = '/profileIcon.jpg',
	size = '2.5rem',
}) => (
	<div
		className='relative shrink-0 grow-0 rounded-full bg-white'
		style={{ width: size, height: size, border: '1px solid #DEE9F5' }}
	>
		<Image
			src={image || '/profileIcon.jpg'}
			alt='User Avatar'
			width={100}
			height={100}
			objectFit='cover'
			className='avatar h-full w-full rounded-full object-cover'
		/>
	</div>
);

export default Avatar;
