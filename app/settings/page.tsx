import ChangePassword from '@/components/pages/changePassword';
import DeleteAccountButton from '@/components/pages/deleteAccount';
import React from 'react';

type Props = {};

const Settings = (props: Props) => {
	return (
		<div>
			<ChangePassword />
			<DeleteAccountButton />
		</div>
	);
};

export default Settings;
