// Metadata
import type { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Uncloud',
	description: `Uncloud is your daily career reflection tool, helping you navigate your professional journey with clarity and confidence. Log your career 'weather', reflect on your feelings, and uncover insights to guide your next steps.`,
};

// Styles
import './styles/globals.css';
import './styles/newLogPopup.css';
import './styles/calendar.css';
import './styles/layout.css';

// Set font
import { Open_Sans } from 'next/font/google';
const openSans = Open_Sans({
	subsets: ['latin'],
	display: 'swap',
});

import Navbar from '@/components/shared/navbar';
import { UserProvider } from './context/UserProvider';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={openSans.className}>
			<head>
				<meta charSet='utf-8' />
			</head>
			<body className='text-textPrimary'>
				<UserProvider>
					<Navbar />
					{children}
				</UserProvider>
			</body>
		</html>
	);
}
