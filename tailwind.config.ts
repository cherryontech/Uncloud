import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./stories/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		fontFamily: {
			sans: ['Open Sans', 'sans-serif'],
		},

		fontSize: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '2rem',
			'4xl': '2.5rem',
			'5xl': '3rem',
			'6xl': '3.5rem',
			'7xl': '3.75rem',
			'8xl': '4.5rem',
			caption: '0.813rem',
		},
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				primary: '#2D81E0',
				backgroundPrimary: '#FFF3E4',
				backgroundSecondary: '#fff',
				buttonColor: '#1A3781',
				backgroundTertiary: '#f3cab6',
				popupBackground: '#1A1A32',
				popupText: '#E6CCCC',
				textPrimary: '#2C2C2C',
				textSecondary: '#6E757C',
				lineColor: '#D9D9D9',
				boxBackground: '#FAFCFF',
				hoverColor: '#DEE9F5',
				blueColor: '#2d81e0',
			},
		},
	},
	plugins: [],
};
export default config;
