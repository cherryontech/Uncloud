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
import CustomInput from '../shared/customInput';

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
	const searchParams = useSearchParams();

	const oobCode = searchParams.get('oobCode');
	// console.log(oobCode);

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

		// Check if there are any errors
		if (Object.values(errors).some((error) => error)) {
			// If there are errors, update the state with the errors
			setErrorField(errors);
			return;
		}
		if (!oobCode) {
			return;
		}
		try {
			await confirmPasswordReset(auth, oobCode, password);
			console.log('Success. Password Changed.');
			router.push('/auth/login');
		} catch (error) {
			console.log(error);
			setError('Password or Email is incorrect');
		}
	};

	return (
		<div className=' flex h-full w-full max-w-[500px] flex-col rounded-2xl bg-backgroundSecondary p-4 shadow-2xl'>
			<div className='flex  w-full flex-col items-center justify-center gap-2'>
				<div className='text-2xl font-medium'>Reset Your Password</div>
				<div className='text-center text-sm font-light'>
					Enter a new password and confirm it below. Please choose a strong
					password that you haven't used before.
				</div>
			</div>
			<form onSubmit={handleSubmit} className='flex flex-col'>
				<CustomInput
					type='password'
					placeholder='Enter your New Password'
					name='password'
					value={resetPass.password}
					label='New Password'
					handleChange={handleChange}
					error={errorField.password}
				/>
				<CustomInput
					type='password'
					placeholder='Confirm Password'
					name='confirmPassword'
					value={resetPass.confirmPassword}
					label='Confirm Password'
					handleChange={handleChange}
					error={errorField.confirmPassword}
				/>
				{error && <p className='text-sm text-red-600'>{error}</p>}
				<button
					className='mt-2 w-full rounded-lg bg-buttonColor py-2 text-white hover:scale-105 hover:shadow-lg'
					type='submit'
				>
					Reset Password
				</button>
				<div>
					Remember Password? <Link href={'/auth/login'}>Login here</Link>{' '}
				</div>
			</form>
		</div>
	);
};

export default ResetPasswordForm;
