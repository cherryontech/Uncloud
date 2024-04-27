import React, { useContext } from 'react';
import { UserContext } from '../context/user';

export const useAuth = () => {
	const { user } = useContext(UserContext);
	console.log(user, UserContext);

	return { user };
};
