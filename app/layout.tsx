import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './newLogPopup.css';
import Navbar from '@/components/shared/navbar';
import 'react-calendar/dist/Calendar.css';
const inter = Inter({ subsets: ['latin'] });
import { UserProvider } from './context/UserProvider';
export const metadata: Metadata = {
	title: 'Uncloud',
	description: `Uncloud is your daily career reflection tool, helping you navigate your professional journey with clarity and confidence. Log your career 'weather', reflect on your feelings, and uncover insights to guide your next steps.`,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<link rel='icon' href='./icon.ico' sizes='any' />
			</head>
			<body className={inter.className}>
				<UserProvider>
					<Navbar />
					{children}
				</UserProvider>
			</body>
		</html>
	);
}
