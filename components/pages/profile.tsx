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
	doc,
	DocumentReference,
	getDoc,
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
import '/app/styles/profile.css';
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

	const genderOptions = [
		'Male',
		'Female',
		'Non-binary',
		'Prefer not to say',
		'Other',
	];
	return (
		<div className=' min-h-[80vh] w-full rounded-2xl border border-[#DEE9F5] bg-white'>
			<div className='w-full rounded-2xl px-[6rem] py-[6rem] '>
				<form onSubmit={handleUserData} className='space-y-4'>
					<div className='flex w-full flex-col items-start justify-between gap-[1.88rem] rounded-xl border border-[#D9D9D9] px-[6.62rem] py-[1.63rem]'>
						<span className='w-full text-xl font-semibold'> Profile Image</span>
						<div className='flex w-full flex-row justify-between'>
							<div className='flex flex-col items-center justify-center'>
								<div className='h-[7.3125rem] w-[7.3125rem]'>
									{imageUpload ? (
										<Image
											src={URL.createObjectURL(imageUpload)}
											width={400}
											height={400}
											className='rounded-full border border-[#D9D9D9] object-cover shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]'
											alt='Preview'
										/>
									) : userDataForm.photoURL && userDataForm.photoURL !== '' ? (
										<Image
											src={userDataForm.photoURL}
											width={400}
											height={400}
											className='rounded-full border border-[#D9D9D9] object-cover shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]'
											alt='Preview'
										/>
									) : (
										<Image
											src='/profile.svg'
											width={600}
											height={600}
											className='rounded-full border border-[#D9D9D9] object-cover shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]'
											alt='Preview'
										/>
									)}
								</div>
							</div>

							<div className='flex items-center justify-center gap-4'>
								<div
									className='bg-grayBackground text-grayTextColor w-fit cursor-pointer rounded-full px-6 py-[0.625rem] !font-bold leading-6 hover:bg-[#DEE9F5] hover:text-blueColor'
									onClick={() => {
										setUserDataForm((prevState) => ({
											...prevState,
											photoURL: '/profile.svg',
										}));
										setChangeFormUserData(true);
									}}
								>
									Remove
								</div>
								<label htmlFor='fileInput'>
									<div className='button--primary w-fit !cursor-pointer rounded-full px-6 py-[0.625rem] text-sm !font-bold leading-6 text-white'>
										Upload New
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
					</div>
					<div className='flex w-full flex-col items-start justify-between gap-[1.88rem] rounded-xl border border-[#D9D9D9] px-[6.62rem] py-[1.63rem]'>
						<span className='w-full gap-[1.88rem] text-xl font-semibold'>
							{' '}
							Personal Information
						</span>
						<div className='flex flex-col gap-[1rem]'>
							<div className='flex w-[39rem] flex-row justify-between'>
								<label className='text-sm font-bold text-[#706f6f]'>Name</label>
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
							<div className='flex w-[39rem] flex-row justify-between'>
								<label className='text-sm font-bold text-[#706f6f]'>
									Gender
								</label>
								<div className='w-80'>
									<CustomSelectDropdown
										onChange={(e) =>
											setUserDataForm((prevState) => ({
												...prevState,
												gender: e.target.value,
											}))
										}
										placeholder='Select'
										name='gender'
										options={genderOptions}
										value={userDataForm.gender}
									/>
								</div>
							</div>
							<div className='flex w-[39rem] flex-row justify-between'>
								<label className='text-sm font-bold text-[#706f6f]'>
									Career Status
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
							<div className='flex w-[39rem] flex-row justify-between'>
								<label className='text-sm font-bold text-[#706f6f]'>
									Location
								</label>
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
										showFlag={false}
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
						<div className='mr-10 flex w-full items-end justify-end space-x-4'>
							<button
								className='bg-grayBackground text-grayTextColor w-fit cursor-pointer rounded-full px-6 py-[0.625rem] !font-bold leading-6 hover:bg-[#DEE9F5] hover:text-blueColor'
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
								className='button--primary w-fit !cursor-pointer rounded-full px-6 py-[0.625rem] text-sm !font-bold leading-6 text-white'
								type='submit'
								disabled={!changeFormUserData}
							>
								Save Changes
							</button>
						</div>
					</div>

					{error && <p className='text-red-600'>{error}</p>}
				</form>
			</div>
		</div>
	);
};

export default Profile;
