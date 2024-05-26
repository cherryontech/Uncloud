'use client';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase';
import CustomInput from './customInput';
import PasswordInput from './passwordInput';
import { Button } from './Button';
import { Icon } from './Icons';
import Image from 'next/legacy/image';

type Props = {};

interface LoginData {
	emailAddress: string;
	password: string;
}
interface FormErrors {
	emailAddress: string;
	password: string;
}

const LoginForm: React.FC<Props> = (props) => {
	const [loginData, setLoginData] = useState<LoginData>({
		emailAddress: '',
		password: '',
	});
	const [errorField, setErrorField] = useState<FormErrors>({
		emailAddress: '',
		password: '',
	});
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const validateField = (name: string, value: string): string => {
		let errorMessage = '';

		if (name === 'emailAddress' && !value.trim()) {
			errorMessage = 'Please enter an email address.';
		} else if (name === 'password' && !value.trim()) {
			errorMessage = 'Please enter a password.';
		} else if (name === 'emailAddress' && !/\S+@\S+\.\S+/.test(value)) {
			errorMessage = 'Email is invalid';
		}

		return errorMessage;
	};

	const validateForm = (formData: LoginData): FormErrors => {
		const errors: FormErrors = {
			emailAddress: validateField('emailAddress', formData.emailAddress),
			password: validateField('password', formData.password),
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

		setLoginData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const { emailAddress, password } = loginData;
		const errors = validateForm(loginData);

		// Check if there are any errors
		if (Object.values(errors).some((error) => error)) {
			// If there are errors, update the state with the errors
			setErrorField(errors);
			return;
		}

		try {
			const authUser = await signInWithEmailAndPassword(
				auth,
				emailAddress,
				password
			); // Assuming auth is properly initialized
			console.log(authUser);
			console.log('Success. The user is Logged In');
			router.push('/');
		} catch (error) {
			console.log(error);
			setError('Incorrect email or password.');
		}
	};

	return (
		// X: 0 y: 5 blur:10 10%
		<div className=' flex h-full w-[26rem] flex-col space-y-6 rounded-xl border border-[#DEE9F5] bg-backgroundSecondary px-6 py-12'>
			<div className='flex flex-col items-center justify-center gap-8 '>
				<Image
					src='/uncloud.svg'
					alt='Uncloud'
					width={64}
					height={64}
					className='shadow-[0_5px_10px_rgba(0,0,0,0.1)]'
				/>
				<div className='flex  max-w-[16.9rem] flex-col items-center justify-center gap-2  space-y-2'>
					<div className='text-3xl font-semibold'>Log in to Uncloud</div>
					<div className='!m-0 text-center text-base font-light text-[#706F6F]'>
						Sign in to translate your feelings into career success.
					</div>
				</div>
			</div>
			<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
				<CustomInput
					type='email'
					placeholder='Please type in your email.'
					name='emailAddress'
					value={loginData.emailAddress}
					label='Email'
					handleChange={handleChange}
					error={error}
				/>
				<div className='flex flex-col gap-2'>
					<PasswordInput
						type='password'
						placeholder='Please type in your password.'
						name='password'
						value={loginData.password}
						label='Password'
						handleChange={handleChange}
						error={error}
					/>
					{/* {error && (
						<p className='text-sm font-semibold text-red-600'>{error}</p>
					)} */}
					<div className='flex justify-end text-sm'>
						<Link
							href={'/auth/forgetPassword'}
							className='text-xs font-medium text-[#2D81E0]  underline '
						>
							Forgot password?
						</Link>{' '}
					</div>
				</div>
				{/* {error && <p className='text-sm text-red-600'>{error}</p>} */}
				<div className='space-y-16'>
					<Button type='submit' label='Log in' primary version='primary' />
					<div className='flex items-center justify-center font-semibold'>
						Not registered yet?&nbsp;{' '}
						<Link
							href={'/auth/signUp'}
							className='font-medium text-[#2D81E0] underline '
						>
							Create an account
						</Link>{' '}
					</div>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
