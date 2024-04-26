import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./stories/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				primary: '#091B50',
				backgroundPrimary: '#FFF3E4',
				backgroundSecondary: '#fff',
				buttonColor: '#1A3781',
				backgroundTertiary: '#f3cab6',
				popupBackground: '#1A1A32',
				popupText: '#E6CCCC',
			},
		},
	},
	plugins: [],
};
export default config;
