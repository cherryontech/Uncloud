import ResetPasswordForm from '@/components/auth/resetPassword';
import React from 'react';

type Props = {};

const ForgetPassword = (props: Props) => {
	return (
		<div className='mt-10 flex w-full items-center justify-center'>
			<ResetPasswordForm />
		</div>
	);
};

export default ForgetPassword;
