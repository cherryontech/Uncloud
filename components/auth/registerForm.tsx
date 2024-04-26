'use client';
import { useState, FormEvent } from 'react';
import { auth } from '@/app/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/app/firebase';
import CustomInput from '../shared/customInput';
import { setDoc, doc } from 'firebase/firestore';

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
			errorMessage = 'Email is invalid';
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
		<div className=' flex h-full w-full max-w-[500px] flex-col rounded-2xl bg-backgroundSecondary p-4 shadow-2xl'>
			<div className='flex  w-full flex-col items-center justify-center gap-2'>
				<div className='text-2xl font-medium'>Welcome to Uncloud!</div>
				<div className='text-center text-sm font-light'>
					Enter your Credentials to Register an Account
				</div>
			</div>
			<form onSubmit={handleSubmit} className='flex flex-col'>
				<CustomInput
					type='email'
					placeholder='Enter your Email'
					name='emailAddress'
					value={registerData.emailAddress}
					label='Email Address'
					handleChange={handleChange}
					error={errorField.emailAddress}
				/>
				<CustomInput
					type='password'
					placeholder='Enter your Password'
					name='password'
					value={registerData.password}
					label='Password'
					handleChange={handleChange}
					error={errorField.password}
				/>
				<CustomInput
					type='text'
					placeholder='Enter your Name'
					value={registerData.displayName}
					name='displayName'
					label='Name'
					handleChange={handleChange}
					error={errorField.displayName}
				/>

				{error && <p className='text-sm text-red-600'>{error}</p>}
				<button
					className='mt-2 w-full rounded-lg bg-buttonColor py-2 text-white hover:scale-105 hover:shadow-lg'
					type='submit'
				>
					Register
				</button>
				<div>
					Already have an account? <Link href={'/auth/login'}>Login</Link>{' '}
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
