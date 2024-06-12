import React from 'react';
import ChangePassword from './changePassword';
import DeleteAccountButton from './deleteAccount';

type Props = {
	mobile: boolean;
};

const Settings = ({ mobile }: Props) => {
	return (
		<div className='px-12 py-4 space-y-4 '>
			<ChangePassword mobile={mobile} />
			<DeleteAccountButton />
		</div>
	);
};

export default Settings;
