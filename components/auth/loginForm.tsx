'use client';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase';
import CustomInput from '../shared/customInput';

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

		if (!value.trim()) {
			errorMessage = 'This field is required';
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
			setError('Password or Email is incorrect');
		}
	};

	return (
		<div className=' flex h-full w-full max-w-[500px] flex-col rounded-2xl bg-backgroundSecondary p-4 shadow-2xl'>
			<div className='flex  w-full flex-col items-center justify-center gap-2'>
				<div className='text-2xl font-medium'>Welcome to Uncloud!</div>
				<div className='text-center text-sm font-light'>
					Enter your Credentials to Login to an Account
				</div>
			</div>
			<form onSubmit={handleSubmit} className='flex flex-col'>
				<CustomInput
					type='email'
					placeholder='Enter your Email'
					name='emailAddress'
					value={loginData.emailAddress}
					label='Email Address'
					handleChange={handleChange}
					error={errorField.emailAddress}
				/>
				<CustomInput
					type='password'
					placeholder='Enter your Password'
					name='password'
					value={loginData.password}
					label='Password'
					handleChange={handleChange}
					error={errorField.password}
				/>

				{error && <p className='text-sm text-red-600'>{error}</p>}
				<button
					className='mt-2 w-full rounded-lg bg-buttonColor py-2 text-white hover:scale-105 hover:shadow-lg'
					type='submit'
				>
					Login
				</button>
				<div>
					Don&apos;t have an account?{' '}
					<Link href={'/auth/signUp'}>Register</Link>{' '}
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
