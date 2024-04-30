import RegisterForm from '@/stories/registerForm';
import React from 'react';

type Props = {};

const SignUp = (props: Props) => {
	return (
		<div className='mt-10 flex w-full items-center justify-center'>
			<RegisterForm />
		</div>
	);
};

export default SignUp;
