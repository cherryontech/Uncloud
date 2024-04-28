import React, { useContext } from 'react';
import { UserContext } from '../context/user';

export const useAuth = () => {
	const { user } = useContext(UserContext);

	return { user };
};
