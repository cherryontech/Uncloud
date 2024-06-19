import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';
import { auth, db, storage } from '@/app/firebase';
import { updateProfile } from 'firebase/auth';
import { GetCountries, GetState } from 'react-country-state-city';
import { doc, DocumentReference, getDoc, updateDoc } from 'firebase/firestore';
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
import DropdownInput from '../shared/DropdownInput';
import { CheckCircle } from '@phosphor-icons/react';
import '/app/styles/customSelect.css';

interface Country {
	id: number;
	name: string;
}

interface State {
	id: number;
	name: string;
}

interface UserDataForm {
	displayName: string;
	careerStatus: string;
	gender: string;
	photoURL: string;
}

interface ProfileProps {
	mobile: boolean;
}

const Profile: React.FC<ProfileProps> = ({ mobile, ...props }) => {
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
	const [countryObj, setCountryObj] = useState<Country>({ id: 0, name: '' });
	const [stateObj, setStateObj] = useState<State>({ id: 0, name: '' });
	const [countryOptions, setCountryOptions] = useState<string[]>([]);
	const [stateOptions, setStateOptions] = useState<string[]>([]);

	const router = useRouter();

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

			GetCountries().then((result: Country[]) => {
				setCountryOptions(result.map((country) => country.name));
			});
		}
	}, [user]);

	useEffect(() => {
		if (countryObj.id) {
			GetState(countryObj.id).then((result: State[]) => {
				setStateOptions(result.map((state) => state.name));
			});
		}
	}, [countryObj.id]);

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

			const userDocRef = doc(db, 'authUsers', user!.uid);
			const userDocSnap = await getDoc(userDocRef);

			if (userDocSnap.exists()) {
				await updateProfile(user!, {
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
			toast('Success', {
				style: { color: '#2c2c2c' },
				className: 'my-classname',
				description: 'User profile updated successfully.',
				duration: 5000,
				icon: <CheckCircle size={16} />,
			});
		} catch (error: any) {
			console.log(error);
			toast.error('Error updating user information: ' + error.message);
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

	if (!user) {
		return null;
	}

	return (
		<div
			className={`w-full  ${!mobile ? 'rounded-2xl border border-[#DEE9F5] bg-white' : '!h-fit'}`}
		>
			<div className={`w-full rounded-2xl px-[6rem] py-[6rem] `}>
				<form onSubmit={handleUserData} className='space-y-4'>
					<div
						className={`flex w-full flex-col items-start justify-between gap-[1.88rem] rounded-xl border border-[#D9D9D9] px-[6.62rem] py-[1.63rem] ${mobile ? 'items-center' : ''}`}
					>
						<span
							className={`w-full text-xl font-semibold ${mobile ? 'items-center justify-center text-center' : ''}`}
						>
							{' '}
							Profile Image
						</span>
						<div
							className={`flex w-full justify-between ${mobile ? 'flex-col justify-start gap-4' : 'flex-row'}`}
						>
							<div className='flex flex-col items-center justify-center'>
								<div className='h-[9rem] w-[9rem]'>
									{imageUpload ? (
										<Image
											src={URL.createObjectURL(imageUpload)}
											width={400}
											height={400}
											className='h-full w-full rounded-full border border-[#D9D9D9] object-cover shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]'
											alt='Preview'
										/>
									) : userDataForm.photoURL && userDataForm.photoURL !== '' ? (
										<Image
											src={userDataForm.photoURL}
											width={400}
											height={400}
											className='h-full w-full rounded-full border border-[#D9D9D9] object-cover shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]'
											alt='Preview'
										/>
									) : (
										<Image
											src='/profile.svg'
											width={600}
											height={600}
											className='h-full w-full rounded-full border border-[#D9D9D9] object-cover shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]'
											alt='Preview'
										/>
									)}
								</div>
							</div>

							<div className='flex items-center justify-center gap-4'>
								<div
									className='w-fit cursor-pointer rounded-full bg-grayBackground px-6 py-[0.625rem] text-sm !font-bold  leading-6 text-grayTextColor hover:bg-[#DEE9F5] hover:text-blueColor'
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
					<div
						className={`flex w-full flex-col items-start justify-between gap-[1.88rem] rounded-xl border border-[#D9D9D9] px-[6.62rem] py-[1.63rem]`}
					>
						<span
							className={`w-full gap-[1.88rem] text-xl font-semibold ${mobile ? 'text-center' : ''}`}
						>
							{' '}
							Personal Information
						</span>
						<div
							className={`flex flex-col gap-[1rem] ${mobile ? 'w-full items-center' : 'w-[38rem]'}`}
						>
							<div
								className={`flex justify-between ${mobile ? 'w-fit flex-col gap-2' : 'flex-row'}`}
							>
								<label className='w-32 text-sm font-bold text-[#706f6f]'>
									Name
								</label>
								<div className={`${mobile ? 'w-80' : 'w-80'}`}>
									<CustomInput
										name={'displayName'}
										handleChange={handleChange}
										type='text'
										placeholder='Enter your Name'
										value={userDataForm.displayName}
									/>
								</div>
							</div>
							<div
								className={`flex flex-row justify-between ${mobile ? 'w-fit flex-col gap-2' : 'flex-row'}`}
							>
								<label className='w-32 text-sm font-bold text-[#706f6f] '>
									Gender
								</label>
								<div className={`${mobile ? 'w-80' : 'w-80'}`}>
									<CustomSelectDropdown
										onChange={(selectedOption) => {
											setUserDataForm((prevState) => ({
												...prevState,
												gender: selectedOption,
											}));
											setChangeFormUserData(true);
										}}
										placeholder='Select'
										name='gender'
										options={genderOptions}
										value={userDataForm.gender}
									/>
								</div>
							</div>
							<div
								className={`flex flex-row justify-between ${mobile ? 'w-fit flex-col gap-2' : 'flex-row'}`}
							>
								<label className='w-32 text-sm font-bold text-[#706f6f] '>
									Career Status
								</label>
								<div className={`${mobile ? 'w-80' : 'w-80'}`}>
									<CustomInput
										name={'careerStatus'}
										handleChange={handleChange}
										type='text'
										placeholder='Enter your Status'
										value={userDataForm.careerStatus}
									/>
								</div>
							</div>
							<div
								className={`flex flex-row justify-between ${mobile ? ' w-fit flex-col gap-2' : 'flex-row'}`}
							>
								<label className='w-32 text-sm font-bold text-[#706f6f]'>
									Location
								</label>
								<div className={`space-y-2 ${mobile ? 'w-80' : 'w-80'}`}>
									<CustomSelectDropdown
										onChange={(selectedOption) => {
											const selectedCountry = countryOptions.find(
												(country) => country === selectedOption
											);
											if (selectedCountry) {
												const countryIndex =
													countryOptions.indexOf(selectedCountry);
												GetCountries().then((result: Country[]) => {
													setCountryObj({
														id: result[countryIndex].id,
														name: selectedOption,
													});
												});
												setChangeFormUserData(true);
												setStateObj({ id: 0, name: '' });
											}
										}}
										placeholder='Select Country'
										name='country'
										options={countryOptions}
										value={countryObj.name}
									/>

									<CustomSelectDropdown
										onChange={(selectedOption) => {
											const selectedState = stateOptions.find(
												(state) => state === selectedOption
											);
											if (selectedState) {
												const stateIndex = stateOptions.indexOf(selectedState);
												GetState(countryObj.id).then((result: State[]) => {
													setStateObj({
														id: result[stateIndex].id,
														name: selectedOption,
													});
												});
												setChangeFormUserData(true);
											}
										}}
										placeholder='Select State'
										name='state'
										options={stateOptions}
										value={stateObj.name}
									/>
								</div>
							</div>
						</div>
						<div
							className={`mr-10 flex w-full items-end space-x-4 ${mobile ? 'justify-center' : 'justify-end'}`}
						>
							<button
								className='w-fit cursor-pointer rounded-full bg-grayBackground px-6 py-[0.625rem] text-sm !font-bold leading-6 text-grayTextColor hover:bg-[#DEE9F5] hover:text-blueColor'
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
