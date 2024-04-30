'use client';
import { useState, FormEvent } from 'react';
import { auth } from '@/app/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/app/firebase';
import CustomInput from './customInput';
import PasswordInput from './passwordInput';
import { Button } from './Button';
import { setDoc, doc } from 'firebase/firestore';
import { Icon } from './Icons';

interface RegisterData {
	displayName: string;
	emailAddress: string;
	password: string;
}
interface FormErrors {
	displayName: string;
	emailAddress: string;
	password: string;
}

const RegisterForm = () => {
	const [registerData, setRegisterData] = useState<RegisterData>({
		displayName: '',
		emailAddress: '',
		password: '',
	});
	const [error, setError] = useState<string | null>(null);
	const [errorField, setErrorField] = useState<FormErrors>({
		displayName: '',
		emailAddress: '',
		password: '',
	});
	const router = useRouter();
	const validateField = (name: string, value: string): string => {
		let errorMessage = '';

		// Validate field
		if (!value.trim()) {
			errorMessage = 'This field is required';
		} else if (name === 'displayName' && value.length > 20) {
			errorMessage = 'Name must be less than 20 characters';
		} else if (name === 'emailAddress' && !/\S+@\S+\.\S+/.test(value)) {
			errorMessage = 'This email is invalid';
		} else if (name === 'password' && value.length < 8) {
			errorMessage = 'Password must be greater than 8 characters';
		}

		return errorMessage;
	};

	const validateForm = (formData: RegisterData): FormErrors => {
		const errors: FormErrors = {
			displayName: validateField('displayName', formData.displayName),
			emailAddress: validateField('emailAddress', formData.emailAddress),
			password: validateField('password', formData.password),
		};

		return errors;
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const errorMessage = validateField(name, value);

		// Update errors state
		setErrorField((prevErrors) => ({
			...prevErrors,
			[name]: errorMessage,
		}));

		setRegisterData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const { emailAddress, password, displayName } = registerData;
		const errors = validateForm(registerData);

		// Check if there are any errors
		if (Object.values(errors).some((error) => error)) {
			// If there are errors, update the state with the errors
			setErrorField(errors);
			return; // Exit early, do not proceed with form submission
		}
		createUserWithEmailAndPassword(auth, emailAddress, password)
			.then((authUser) => {
				if (authUser.user) {
					updateProfile(authUser.user, {
						displayName: displayName,
					})
						.then(() => {
							setDoc(doc(db, 'authUsers', authUser.user.uid), {
								email: emailAddress,
								displayName: displayName,
								closedConfirmationMessage: false,
							})
								.then((docRef: any) => {
									router.push('/');
								})
								.catch((e) => {
									console.error('Error updating document', e);
								});
						})
						.catch((error) => {
							console.error('Error updating user display name:', error);
						});
				}
			})
			.catch((error) => {
				console.error(error.message);
				setError('This email is already registered');
			});
	};

	return (
		<div className=' flex h-full w-full max-w-[500px] flex-col space-y-6 bg-backgroundSecondary p-4 py-6'>
			<div className='flex flex-col items-center justify-center gap-2 '>
				<Icon type='cloud-sun' size='6rem' weight='regular' />
				<div className='flex  w-full flex-col items-center justify-center gap-2  space-y-2'>
					<div className='text-3xl font-semibold'>Welcome to Uncloud</div>
					<div className='text-center text-base font-light'>
						Add an email address, name, and password to complete your account.
					</div>
				</div>
			</div>
			<form onSubmit={handleSubmit} className='flex flex-col'>
				<CustomInput
					type='email'
					placeholder='Please type your email.'
					name='emailAddress'
					value={registerData.emailAddress}
					label="What's your email?"
					handleChange={handleChange}
					error={errorField.emailAddress}
				/>
				<CustomInput
					type='text'
					placeholder='Please type your preferred name.'
					value={registerData.displayName}
					name='displayName'
					label='What should we call you?'
					handleChange={handleChange}
					error={errorField.displayName}
				/>
				<PasswordInput
					type='password'
					placeholder='Please type in your password.'
					name='password'
					value={registerData.password}
					label='Password'
					handleChange={handleChange}
					error={errorField.password}
					// If there is an error, make the border red
				/>

				{error && <p className='text-sm text-red-600'>{error}</p>}
				<div className='space-y-16'>
					<Button type='submit' label='Continue' primary />
					<div className='flex items-center justify-center font-semibold'>
						Already have an account?&nbsp;{' '}
						<Link
							href={'/auth/login'}
							className='font-medium text-blue-500 underline'
						>
							Login
						</Link>{' '}
					</div>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
