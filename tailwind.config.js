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
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}