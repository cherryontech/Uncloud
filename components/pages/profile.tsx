'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

import { toast } from 'sonner';
import { auth, db, storage } from '@/app/firebase';
import {
	AuthCredential,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
	updateProfile,
	User,
} from 'firebase/auth';

import {
	collection,
	doc,
	DocumentReference,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import {
	getDownloadURL,
	ref as storageRef,
	uploadBytes,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useAuth } from '@/app/context/UserProvider';
import CustomInput from '@/stories/customInput';
import { getUser } from '../utils/serverFunctions';
import { useRouter } from 'next/navigation';

interface UserDataForm {
	displayName: string;
	location: string;
	photoURL: string;
}

interface PasswordForm {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const Profile: React.FC = () => {
	const [userDataForm, setUserDataForm] = useState<UserDataForm>({
		displayName: '',
		location: '',
		photoURL: '',
	});
	const [imageUpload, setImageUpload] = useState<File | null>(null);
	const [passwordForm, setPasswordForm] = useState<PasswordForm>({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [errorPassword, setErrorPassword] = useState<string | null>(null);
	const [changeFormUserData, setChangeFormUserData] = useState<boolean>(false);
	const [changePassword, setChangePassword] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [userPopData, setUserPopData] = useState<any | null>(null);
	const { user, updateData, refetchUser } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData: any) => {
				setUserPopData(userData);
				setUserDataForm({
					displayName: userData?.displayName,
					location: userData?.location || '',
					photoURL: userData?.photoURL || '',
				});
			});
		}
	}, [user]);
	if (!user) {
		return null;
	}
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserDataForm((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setChangeFormUserData(true);
	};

	const handleSecondFormChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm((prevState) => ({
			...prevState,
			[name]: value,
		}));
		setChangePassword(true);
	};

	const handleChangePassword = async (e: FormEvent) => {
		e.preventDefault();
		setErrorPassword(null);
		setChangePassword(false);

		try {
			const { oldPassword, newPassword, confirmPassword } = passwordForm;
			if (newPassword !== confirmPassword) {
				setErrorPassword('Passwords do not match');
				return;
			}
			if (oldPassword === confirmPassword) {
				setErrorPassword('You cannot use the Old password Again');
				return;
			}
			const recentUser = auth.currentUser;
			if (!recentUser) throw new Error('No authenticated user found');
			const credential: AuthCredential = EmailAuthProvider.credential(
				user?.email || '',
				oldPassword
			);
			await reauthenticateWithCredential(recentUser, credential);

			await updatePassword(recentUser, newPassword);
			toast.success('Password Changed Successfully');
		} catch (error: any) {
			console.log(error);
			setErrorPassword(error.message);
		}
	};

	const handleUserData = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setChangeFormUserData(false);
		try {
			const { displayName, location, photoURL } = userDataForm;
			if (!displayName) {
				setError('Name is required');
				return;
			}
			let imageUrl = photoURL;
			if (imageUpload !== null) {
				const imageRef = storageRef(storage, `${uuidv4()}`);

				const snapshot = await uploadBytes(imageRef, imageUpload);
				imageUrl = await getDownloadURL(snapshot.ref);
			}

			const userDocRef = doc(db, 'authUsers', user.uid);
			const userDocSnap = await getDoc(userDocRef);

			if (userDocSnap.exists()) {
				await updateProfile(user, {
					displayName: displayName,
					photoURL: imageUrl,
				});
				await updateDoc(userDocRef as DocumentReference, {
					displayName: displayName,
					location: location,
					photoURL: imageUrl,
				});
			} else {
				toast.error('User document not found');
				return;
			}
			router.refresh();
			toast.success('User Info Updated Successfully');
		} catch (error: any) {
			console.log(error);
			toast.error('Error updating user info: ' + error.message);
			setError(error.message);
		}
	};
	console.log(userDataForm);
	return (
		<div className='backgroundPrimary mx-3 h-full min-h-[80vh] w-full rounded-lg p-5'>
			<div className='flex items-center justify-center gap-5'>
				<div className='w-[60%] rounded-2xl bg-white p-10 '>
					<h2 className='text-2xl font-bold'>User Profile</h2>
					<form onSubmit={handleUserData}>
						{imageUpload ? (
							<Image
								src={URL.createObjectURL(imageUpload)}
								width={400}
								height={400}
								className='h-40 w-40 rounded-full object-cover'
								alt='Preview'
							/>
						) : userDataForm.photoURL && userDataForm.photoURL !== '' ? (
							<Image
								src={userDataForm.photoURL}
								width={400}
								height={400}
								className='h-40 w-40 rounded-full object-cover'
								alt='Preview'
							/>
						) : (
							<Image
								src='/profileIcon.jpg'
								width={400}
								height={400}
								className='h-40 w-40 rounded-full object-cover'
								alt='Preview'
							/>
						)}

						<label htmlFor='fileInput'>
							<div className='button--primary mt-2 w-fit cursor-pointer rounded-lg px-4 py-2 text-sm text-white'>
								Choose Image
							</div>
							<input
								id='fileInput'
								style={{ display: 'none' }}
								accept='image/png,image/jpeg'
								type='file'
								onChange={(e) => {
									if (e.target.files) {
										setImageUpload(e.target.files[0]);
										setChangeFormUserData(true);
									}
								}}
							/>
						</label>
						<CustomInput
							name={'displayName'}
							label={'Name:'}
							handleChange={handleChange}
							type='text'
							placeholder='Enter your Name'
							value={userDataForm.displayName}
						/>
						<CustomInput
							name={'location'}
							label={'Location:'}
							handleChange={handleChange}
							type='text'
							placeholder='Enter your Location'
							value={userDataForm.location}
						/>
						{error && <p className='text-red-600'>{error}</p>}
						<button
							className='button--primary mt-2 w-full rounded-full py-2 text-white'
							type='submit'
							disabled={!changeFormUserData}
						>
							Save
						</button>
					</form>
				</div>
				<div className='w-[37%] rounded-2xl bg-white p-10'>
					<h2 className='text-xl font-bold'>Account Information</h2>
					<form onSubmit={handleChangePassword}>
						<CustomInput
							name={'oldPassword'}
							label={'Old Password:'}
							handleChange={handleSecondFormChange}
							type='password'
							placeholder='Enter your Old Password'
							value={passwordForm.oldPassword}
						/>
						<CustomInput
							name={'newPassword'}
							label={'New Password:'}
							handleChange={handleSecondFormChange}
							type='password'
							placeholder='Enter your New Password'
							value={passwordForm.newPassword}
						/>
						<CustomInput
							name={'confirmPassword'}
							label={'Confirm Password:'}
							handleChange={handleSecondFormChange}
							type='password'
							placeholder='Enter your Password Again'
							value={passwordForm.confirmPassword}
						/>
						{errorPassword && <p className='text-red-600'>{errorPassword}</p>}
						<button
							className='button--primary mt-2 w-full rounded-full py-2 text-white'
							type='submit'
							disabled={!changePassword}
						>
							Save
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Profile;
