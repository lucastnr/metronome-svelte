/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			dark: '#212227',
			gray: '#49606E',
			primary: '#20666F',
			secondary: '#2EC4B6',
			tertiary: '#A8BA9A',
			white: '#F3F3F3'
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif']
		},
		extend: {}
	},
	plugins: []
};
