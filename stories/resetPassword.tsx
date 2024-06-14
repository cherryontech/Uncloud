'use client';
import React, { useState } from 'react';
import {
	confirmPasswordReset,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase';
import PasswordInput from './passwordInput';
import { Icon } from './Icons';
import { Button } from './Button';
import { ProgressTracker } from './progressTracker';

type Props = {};

interface ForgetPass {
	password: string;
	confirmPassword: string;
}
interface FormErrors {
	password: string;
	confirmPassword: string;
}
const ResetPasswordForm: React.FC<Props> = (props) => {
	const [resetPass, setResetPassData] = useState<ForgetPass>({
		password: '',
		confirmPassword: '',
	});
	const [errorField, setErrorField] = useState<FormErrors>({
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState(false);
	const searchParams = useSearchParams();

	const oobCode = searchParams.get('oobCode');

	const router = useRouter();
	const validateField = (name: string, value: string): string => {
		let errorMessage = '';

		if (!value.trim()) {
			errorMessage = 'This field is required';
		} else if (name === 'password' && value.length < 8) {
			errorMessage = 'Password must be greater than 8 characters';
		} else if (name === 'confirmPassword' && resetPass.password !== value) {
			errorMessage = 'Confirm Password must be same as Password';
		}

		return errorMessage;
	};

	const validateForm = (formData: ForgetPass): FormErrors => {
		const errors: FormErrors = {
			password: validateField('password', formData.password),
			confirmPassword: validateField(
				'confirmPassword',
				formData.confirmPassword
			),
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

		setResetPassData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const { password, confirmPassword } = resetPass;
		const errors = validateForm(resetPass);

		if (Object.values(errors).some((error) => error)) {
			setErrorField(errors);
			return;
		}
		if (!oobCode) {
			return;
		}
		try {
			await confirmPasswordReset(auth, oobCode, password);
			console.log('Success. Password Changed.');

			setSuccessMessage(true);
		} catch (error) {
			console.log(error);
			setError('Password or Email is incorrect');
		}
	};
	const handleLoginClick = () => {
		router.push('/auth/login');
	};
	return (
		<div className=' flex h-full w-full max-w-[24rem] flex-col space-y-6 bg-backgroundSecondary p-4 py-6'>
			{successMessage ? (
				<div className='flex h-[47.75rem] flex-col justify-between'>
					<div className='flex  w-full flex-col items-center justify-center gap-6'>
						<div className='flex flex-col items-center justify-center gap-6 '>
							<div className=' flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-lineColor bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]'>
								<Icon type='envelope-open' size='2rem' weight='regular' />
							</div>
							<div className='flex  w-full flex-col items-center justify-center gap-2  space-y-2'>
								<div className='text-center text-3xl font-semibold'>
									Password Successfully Changed!
								</div>
								<div className='text-center text-base font-light'>
									Your password has been successfully updated.
								</div>
							</div>
						</div>
						<Button
							type='button'
							label='Log in'
							primary
							onClick={handleLoginClick}
							version='primary'
						/>
					</div>
					<ProgressTracker totalSteps={4} currentStep={4} />
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
									<div className='text-3xl font-semibold'>
										Reset Your Password
									</div>
									<div className='text-center text-base font-light'>
										Enter a new password and confirm it below. Please choose a
										strong password that you haven&apos;t used before.
									</div>
								</div>
							</div>
							<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
								<PasswordInput
									type='password'
									placeholder='Enter new password'
									name='password'
									value={resetPass.password}
									label='New Password'
									handleChange={handleChange}
									error={errorField.password}
								/>
								<PasswordInput
									type='password'
									placeholder='Re-enter new password'
									name='confirmPassword'
									value={resetPass.confirmPassword}
									label='Confirm New Password'
									handleChange={handleChange}
									error={errorField.confirmPassword}
								/>
								{error && <p className='text-sm text-red-600'>{error}</p>}
								<div className='space-y-16'>
									<Button
										type='submit'
										label='Reset Password'
										primary
										version='primary'
									/>
									<div className='flex flex-wrap items-center justify-center font-semibold'>
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
						<ProgressTracker totalSteps={4} currentStep={3} />
					</div>
				</>
			)}
		</div>
	);
};

export default ResetPasswordForm;
