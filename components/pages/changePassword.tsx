'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { auth } from '@/app/firebase';
import {
	AuthCredential,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from 'firebase/auth';
import { useAuth } from '@/app/context/UserProvider';

type Props = {
	mobile: boolean;
};
interface PasswordForm {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}
import { toast } from 'sonner';
import CustomInput from '@/stories/customInput';

const ChangePassword = ({ mobile }: Props) => {
	const [errorPassword, setErrorPassword] = useState<string | null>(null);
	const [changePassword, setChangePassword] = useState<boolean>(false);
	const [passwordForm, setPasswordForm] = useState<PasswordForm>({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const { user, updateData, refetchUser } = useAuth();

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
			setPasswordForm({
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			toast.success('Password Changed Successfully');
		} catch (error: any) {
			console.log(error);
			setErrorPassword(error.message);
		}
	};
	return (
		<div
			className={`flex w-full flex-col items-start justify-between gap-[1.88rem] rounded-xl border border-[#D9D9D9] px-[6.62rem] py-[1.63rem]`}
		>
			{' '}
			<form
				onSubmit={handleChangePassword}
				className='flex w-full flex-col items-center justify-center space-y-8'
			>
				<div
					className={`flex flex-col gap-[1rem] ${mobile ? 'w-full items-center' : 'w-[38rem]'}`}
				>
					<span
						className={`w-full gap-[1.88rem] text-xl font-semibold ${mobile ? 'text-center' : ''}`}
					>
						{' '}
						Change Password
					</span>{' '}
					<div
						className={`flex justify-between ${mobile ? 'w-fit flex-col gap-2' : 'flex-row'}`}
					>
						<label className='w-32 text-sm font-bold text-[#706f6f]'>
							Old Password:
						</label>
						<div className={`${mobile ? 'w-80' : 'w-80'}`}>
							<CustomInput
								name={'oldPassword'}
								handleChange={handleSecondFormChange}
								type='password'
								placeholder='Enter your Old Password'
								value={passwordForm.oldPassword}
							/>
						</div>
					</div>
					<div
						className={`flex justify-between ${mobile ? 'w-fit flex-col gap-2' : 'flex-row'}`}
					>
						<label className='w-32 text-sm font-bold text-[#706f6f]'>
							New Password:
						</label>
						<div className={`${mobile ? 'w-80' : 'w-80'}`}>
							<CustomInput
								name={'newPassword'}
								handleChange={handleSecondFormChange}
								type='password'
								placeholder='Enter your New Password'
								value={passwordForm.newPassword}
							/>
							<p className='text-xs'>
								Passwords need to have atleast 8 characters
							</p>
						</div>
					</div>
					<div
						className={`flex justify-between ${mobile ? 'w-fit flex-col gap-2' : 'flex-row'}`}
					>
						<label className='w-60 text-sm font-bold text-[#706f6f]'>
							Confirm New Password:
						</label>
						<div className={`${mobile ? 'w-80' : 'w-80'}`}>
							<CustomInput
								name={'confirmPassword'}
								handleChange={handleSecondFormChange}
								type='password'
								placeholder='Enter your Password Again'
								value={passwordForm.confirmPassword}
							/>
						</div>
					</div>
				</div>

				<div
					className={`mr-10 flex w-full items-end space-x-4 ${mobile ? 'justify-center' : 'justify-end'}`}
				>
					<button
						className='bg-grayBackground text-grayTextColor w-fit cursor-pointer rounded-full px-6 py-[0.625rem] text-sm !font-bold leading-6 hover:bg-[#DEE9F5] hover:text-blueColor'
						type='button'
						onClick={() => {
							setPasswordForm({
								oldPassword: '',
								newPassword: '',
								confirmPassword: '',
							});
							setChangePassword(false);
						}}
						disabled={!changePassword}
					>
						Cancel
					</button>

					<button
						className='button--primary w-fit !cursor-pointer rounded-full px-6 py-[0.625rem] text-sm !font-bold leading-6 text-white'
						type='submit'
						disabled={!changePassword}
					>
						Save Changes
					</button>
				</div>
				{errorPassword && <p className='text-red-600'>{errorPassword}</p>}
			</form>
		</div>
	);
};

export default ChangePassword;
