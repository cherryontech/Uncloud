'use client';
import React, { useState } from 'react';
import {
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase';
import CustomInput from './customInput';
import { Icon } from './Icons';
import { Button } from './Button';
import { ProgressTracker } from './progressTracker';

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
		<div className=' flex h-full w-full max-w-[24rem] flex-col space-y-6 bg-backgroundSecondary p-4 py-6'>
			{emailMessage ? (
				<div className='flex  h-[47.75rem] w-full flex-col items-center justify-between gap-2'>
					<div className='flex flex-col'>
						<div className='flex flex-col items-center justify-center gap-6 '>
							<div className=' flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-lineColor bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]'>
								<Icon type='envelope-open' size='2rem' weight='regular' />
							</div>
							<div className='flex  w-full flex-col items-center justify-center gap-2  space-y-2'>
								<div className='text-center text-3xl font-semibold'>
									Check Your Email
								</div>
								<div className='text-center text-base font-light'>
									Check your email for instructions on resetting your password.
									Follow the link provided to create a new password.
								</div>
							</div>
						</div>
						<br />
						<div className='flex items-center justify-center font-semibold'>
							Remembered password? &nbsp;{' '}
							<Link
								href={'/auth/login'}
								className='font-medium text-blue-500 underline'
							>
								Log in here.
							</Link>{' '}
						</div>
					</div>
					<ProgressTracker totalSteps={4} currentStep={2} />
				</div>
			) : (
				<>
					<div className='flex h-[47.75rem] flex-col justify-between'>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-center justify-center gap-6 '>
								<div className=' flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-lineColor bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]'>
									<Icon type='lock-key' size='2rem' weight='regular' />
								</div>
								<div className='flex  w-full flex-col items-center justify-center gap-2  space-y-2'>
									<div className='text-3xl font-semibold'>Forgot Password?</div>
									<div className='text-center text-base font-light'>
										No worries! Please enter the email associated with your
										account and a secure link with instructions will be sent to
										your inbox.
									</div>
								</div>
							</div>
							<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
								<CustomInput
									type='email'
									placeholder='Please type your email'
									name='emailAddress'
									value={forgetPass.emailAddress}
									label='Email'
									handleChange={handleChange}
									error={errorField.emailAddress}
								/>

								{error && <p className='text-sm text-red-600'>{error}</p>}
								<div className='space-y-16'>
									<Button type='submit' label='Send Link' primary />
									<div className='flex items-center justify-center font-semibold'>
										Remembered password? &nbsp;{' '}
										<Link
											href={'/auth/login'}
											className='font-medium text-blue-500 underline'
										>
											Log in here.
										</Link>{' '}
									</div>
								</div>
							</form>
						</div>
						<ProgressTracker totalSteps={4} currentStep={1} />
					</div>
				</>
			)}
		</div>
	);
};

export default ForgetPasswordForm;
