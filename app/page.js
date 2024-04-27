'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAuth } from './auth/useAuth';
import { UserProvider } from './context/UserProvider';
export default function Home() {
	const { user } = useAuth();
	return (
		<UserProvider>
			<div>
				Home
				{!!user ? (
					<div>Hi, {user.displayName}</div>
				) : (
					<div>no user authenticated</div>
				)}
			</div>
		</UserProvider>
	);
}
