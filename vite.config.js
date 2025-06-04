import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backendUrlDev = 'http://localhost:8000'
const backendUrlProd = 'http://server:8000'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss()],
	server: {
		host: '0.0.0.0',
		proxy: {
			'^/api': {
				target: mode == 'development' ? backendUrlDev : backendUrlProd,
				changeOrigin: true,
				ws: false,
				secure: false,
			},
		},
	},
}))
