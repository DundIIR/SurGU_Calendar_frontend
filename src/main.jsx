import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { BrowserRouter } from 'react-router-dom'
import App from '../src/components/App/App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ChakraProvider } from '@chakra-ui/react'
import './scss/main.scss'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<ChakraProvider resetCSS={false}>
		<Provider store={store}>
			<SessionContextProvider supabaseClient={supabase}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</SessionContextProvider>
		</Provider>
	</ChakraProvider>,
)
