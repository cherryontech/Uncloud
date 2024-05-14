import React from 'react';
import Image from 'next/image';

type Props = {
	// src: string;
	size?: number;
};

const Avatar: React.FC<Props> = ({
	// src = './moods/sunny.svg',
	size = '2rem',
}) => (
	<div
		className='relative shrink-0 grow-0 rounded-full bg-white'
		style={{ width: size, height: size }}
	>
		<Image
			src='./moods/sunny.svg'
			alt='User Avatar'
			layout='fill'
			className='avatar'
		/>
	</div>
);

export default Avatar;
