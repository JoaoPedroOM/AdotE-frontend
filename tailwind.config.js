/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			main: 'Passion One',
  			second: 'Englebert',
  			tertiary: 'Jost'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backgroundImage: {
  			'radial-gradient': 'radial-gradient(circle at 50% 50%, transparent 20%, #feecd1 90%)'
  		},
  		colors: {},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  		},
		screens: {
			'sm-max': { 'max': '39.99rem' },
			'md-max': { 'max': '57.5rem' },
			'lg-max': { 'max': '64rem' },
			'xl-max': { 'max': '75rem' },
			'xl-min': { 'min': '75rem' },
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}