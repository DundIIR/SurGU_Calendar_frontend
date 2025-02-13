import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		// proxy: {
		// 	'^/api': {
		// 		target: backendUrlDev,
		// 		ws: false,
		// 		secure: false,
		// 	},
		// },
	},
}))
