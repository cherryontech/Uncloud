import LogoutConfirmation from '@/stories/confirmLogout';
import React from 'react';

type Props = {};

const confirmLogout = (props: Props) => {
	return (
		<div className='mt-[8rem] flex w-full items-center justify-center'>
			<LogoutConfirmation />
		</div>
	);
};

export default confirmLogout;
