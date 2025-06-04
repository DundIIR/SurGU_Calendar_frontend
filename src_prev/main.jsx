import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App/App.jsx'
import './scss/main.scss'
import { ChakraProvider } from '@chakra-ui/react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<SessionContextProvider supabaseClient={supabase}>
			<BrowserRouter>
				<ChakraProvider>
					<App />
				</ChakraProvider>
			</BrowserRouter>
		</SessionContextProvider>
	</React.StrictMode>,
)
