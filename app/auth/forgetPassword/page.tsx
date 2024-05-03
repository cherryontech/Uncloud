import ForgetPasswordForm from '@/components/auth/forgetPassword';
import React from 'react';

type Props = {};

const ForgetPassword = (props: Props) => {
	return (
		<div className='mt-10 flex w-full items-center justify-center'>
			<ForgetPasswordForm />
		</div>
	);
};

export default ForgetPassword;
