module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				primary: "#234800ff",
				secondary: "#F7DBA7",
				accent: "#1b3b17ff",
				background: "#315304ff",
				text: "#EBE3C1",
				blue: {
					50: '#f0fff2ff',
					900: '#1e8a30ff',
				},
			},
			fontFamily: {
				abril: ["Abril Fatface", "sans-serif"],
				advent: ["Advent Pro", "sans-serif"],
				actor: ["Actor", "sans-serif"],
				sans: ['Open Sans', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
				roboto: ['Roboto', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				Tomorrow: ['Tomorrow', 'sans-serif'],
				'space-grotesk': ['Space Grotesk', 'sans-serif'], // Custom font family
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
