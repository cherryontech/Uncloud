import React, { ChangeEvent, FormEvent, useState } from 'react';
import CustomInput from '../shared/customInput';
import { auth } from '@/app/firebase';
import {
	AuthCredential,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from 'firebase/auth';
import { useAuth } from '@/app/context/UserProvider';

type Props = {};
interface PasswordForm {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}
import { toast } from 'sonner';

const Setting = (props: Props) => {
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
			toast.success('Password Changed Successfully');
		} catch (error: any) {
			console.log(error);
			setErrorPassword(error.message);
		}
	};
	return (
		<div>
			<div className='w-full rounded-2xl bg-white p-10'>
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
	);
};

export default Setting;
