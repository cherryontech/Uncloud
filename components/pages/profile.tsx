'use client';
import React, {
	useEffect,
	useState,
	ChangeEvent,
	FormEvent,
	useRef,
} from 'react';

import { toast } from 'sonner';
import { auth, db, storage } from '@/app/firebase';
import { updateProfile } from 'firebase/auth';
import {
	CitySelect,
	CountrySelect,
	StateSelect,
	LanguageSelect,
} from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
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
import CustomDropdown from '../shared/customDropdown';
import CustomSelectDropdown from '../shared/customSelectDropdown';

interface UserDataForm {
	displayName: string;
	careerStatus: string;
	gender: string;
	photoURL: string;
}

const Profile: React.FC = () => {
	const [userDataForm, setUserDataForm] = useState<UserDataForm>({
		displayName: '',
		photoURL: '',
		careerStatus: '',
		gender: '',
	});
	const [imageUpload, setImageUpload] = useState<File | null>(null);

	const [changeFormUserData, setChangeFormUserData] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [userPopData, setUserPopData] = useState<any | null>(null);
	const { user, updateData, refetchUser } = useAuth();
	const [countryObj, setCountryObj] = useState({ id: 0, name: '' });
	const [stateObj, setStateObj] = useState({ id: 0, name: '' });

	const router = useRouter();
	const stateSelectDivRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (user) {
			getUser(user.uid).then((userData: any) => {
				setUserPopData(userData);
				setUserDataForm({
					displayName: userData?.displayName,

					photoURL: userData?.photoURL || '',
					careerStatus: userData?.careerStatus || '',
					gender: userData?.gender || '',
				});
				console.log(userData);

				userData?.location?.country &&
					setCountryObj(userData?.location?.country);
				userData?.location?.state && setStateObj(userData?.location?.state);
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

	const handleUserData = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setChangeFormUserData(false);
		try {
			const { displayName, photoURL, careerStatus, gender } = userDataForm;
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
					location: {
						country: countryObj,
						state: stateObj,
					},
					careerStatus: careerStatus,
					gender: gender,
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
	console.log(countryObj);
	const genderOptions = ['male', 'female', 'other'];
	return (
		<div className='backgroundPrimary mx-3 h-full min-h-[80vh] w-full rounded-lg'>
			<div className=' p-5 md:p-10'>
				<div className='w-full rounded-2xl bg-white p-10 '>
					<form onSubmit={handleUserData} className='space-y-4'>
						<div className='flex w-full items-center justify-between rounded-xl border border-gray-400 px-10 py-4'>
							<div className='flex flex-col items-center justify-center'>
								<h2 className='text-xl font-bold'> Profile Image</h2>
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
							</div>

							<div className='flex items-center justify-center gap-4'>
								<div
									className='bg-grayBackground text-grayTextColor  w-fit cursor-pointer rounded-full px-4 py-2 !font-[12px]  hover:bg-[#DEE9F5] hover:text-blueColor'
									onClick={() => {
										setUserDataForm((prevState) => ({
											...prevState,
											photoURL: '',
										}));
										setChangeFormUserData(true);
									}}
								>
									Remove Image
								</div>
								<label htmlFor='fileInput'>
									<div className='button--primary  w-fit cursor-pointer rounded-full px-4 py-2 text-sm !font-[12px] text-white'>
										Upload Image
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
							</div>
						</div>
						<div className='flex w-full flex-col  justify-between gap-2 rounded-xl border border-gray-400 px-10 py-4'>
							<div className='flex flex-row '>
								<label className='w-60  text-sm font-bold'>Name:</label>
								<div className='w-80'>
									<CustomInput
										name={'displayName'}
										handleChange={handleChange}
										type='text'
										placeholder='Enter your Name'
										value={userDataForm.displayName}
									/>
								</div>
							</div>
							<div className='flex flex-row '>
								<label className='w-60  text-sm font-bold'>Gender:</label>
								<div className='w-80'>
									<CustomSelectDropdown
										onChange={(e) =>
											setUserDataForm((prevState) => ({
												...prevState,
												gender: e.target.value,
											}))
										}
										placeholder='Select Gender'
										name='gender'
										options={genderOptions}
										value={userDataForm.gender}
									/>
								</div>
							</div>
							<div className='flex flex-row '>
								<label className='w-60  text-sm font-bold'>
									Career Status:
								</label>
								<div className='w-80'>
									<CustomInput
										name={'careerStatus'}
										handleChange={handleChange}
										type='text'
										placeholder='Enter your Status'
										value={userDataForm.careerStatus}
									/>
								</div>
							</div>
							<div className='flex flex-row '>
								<label className='w-60 text-sm font-bold'>Location:</label>
								<div className='w-80 space-y-2'>
									<CountrySelect
										defaultValue={countryObj}
										onChange={(e: any) => {
											setCountryObj({ id: e.id, name: e.name });
											setChangeFormUserData(true);
											setStateObj({ id: 0, name: '' });
										}}
										containerClassName='w-full'
										placeHolder='Select Country'
									/>

									<StateSelect
										defaultValue={stateObj}
										countryid={countryObj.id}
										containerClassName='w-full'
										onChange={(e: any) => {
											setStateObj({ id: e.id, name: e.name });
											setChangeFormUserData(true);
										}}
										placeHolder='Select State'
									/>
								</div>
							</div>
						</div>

						{error && <p className='text-red-600'>{error}</p>}
						<div className='w-full items-end'>
							<button
								className='bg-grayBackground text-grayTextColor  w-fit cursor-pointer rounded-full px-4 py-2 !font-[12px]  hover:bg-[#DEE9F5] hover:text-blueColor'
								type='button'
								onClick={() => {
									setUserDataForm({ ...userPopData });
									setImageUpload(null);
								}}
								disabled={!changeFormUserData}
							>
								Cancel
							</button>

							<button
								className='button--primary mt-2 w-fit rounded-full px-4 py-2 font-[12px]  text-white'
								type='submit'
								disabled={!changeFormUserData}
							>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Profile;
