'use client';
import React, { useState } from 'react';
import {
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase';
import CustomInput from '../shared/customInput';

type Props = {};

interface ForgetPass {
	emailAddress: string;
}
interface FormErrors {
	emailAddress: string;
}
const ForgetPasswordForm: React.FC<Props> = (props) => {
	const [forgetPass, setForgetPassData] = useState<ForgetPass>({
		emailAddress: '',
	});
	const [errorField, setErrorField] = useState<FormErrors>({
		emailAddress: '',
	});
	const [error, setError] = useState<string | null>(null);
	const [emailMessage, setEmailMessage] = useState(false);
	const router = useRouter();
	const validateField = (name: string, value: string): string => {
		let errorMessage = '';

		if (!value.trim()) {
			errorMessage = 'This field is required';
		} else if (name === 'emailAddress' && !/\S+@\S+\.\S+/.test(value)) {
			errorMessage = 'Email is invalid';
		}

		return errorMessage;
	};

	const validateForm = (formData: ForgetPass): FormErrors => {
		const errors: FormErrors = {
			emailAddress: validateField('emailAddress', formData.emailAddress),
		};

		return errors;
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const errorMessage = validateField(name, value);

		setErrorField((prevErrors) => ({
			...prevErrors,
			[name]: errorMessage,
		}));

		setForgetPassData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const { emailAddress } = forgetPass;
		const errors = validateForm(forgetPass);

		// Check if there are any errors
		if (Object.values(errors).some((error) => error)) {
			// If there are errors, update the state with the errors
			setErrorField(errors);
			return;
		}

		try {
			const resp = await sendPasswordResetEmail(auth, emailAddress);
			console.log('Success. Email sent to the user.', resp);
			setEmailMessage(true);
		} catch (error) {
			console.log(error);
			setError('Password or Email is incorrect');
		}
	};

	return (
		<div className=' flex h-full w-full max-w-[500px] flex-col rounded-2xl bg-backgroundSecondary p-4 shadow-2xl'>
			{emailMessage ? (
				<div className='flex  w-full flex-col items-center justify-center gap-2'>
					<div className='text-2xl font-medium'>Check your Email</div>
					<div className='text-center text-sm font-light'>
						Check your email for a password reset link. Follow the instructions
						to create a new password.
					</div>
					<br />
					<div>
						Remember Password? <Link href={'/auth/login'}>Login here</Link>{' '}
					</div>
				</div>
			) : (
				<>
					<div className='flex  w-full flex-col items-center justify-center gap-2'>
						<div className='text-2xl font-medium'>Forgotten Password?</div>
						<div className='text-center text-sm font-light'>
							Oops! Can&apos;t remember your password? No worries! Please enter
							your email below. A secure link will be sent to your inbox for
							password recovery.
						</div>
					</div>
					<form onSubmit={handleSubmit} className='flex flex-col'>
						<CustomInput
							type='email'
							placeholder='Enter your Email'
							name='emailAddress'
							value={forgetPass.emailAddress}
							label='Email Address'
							handleChange={handleChange}
							error={errorField.emailAddress}
						/>

						{error && <p className='text-sm text-red-600'>{error}</p>}
						<button
							className='mt-2 w-full rounded-lg bg-buttonColor py-2 text-white hover:scale-105 hover:shadow-lg'
							type='submit'
						>
							Send Link
						</button>
						<div>
							Remember Password? <Link href={'/auth/login'}>Login here</Link>{' '}
						</div>
					</form>
				</>
			)}
		</div>
	);
};

export default ForgetPasswordForm;
