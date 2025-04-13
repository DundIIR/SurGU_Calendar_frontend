import './_header.scss'
import logo from '../../img/logo-surgu-calendar.svg'
import { useSession } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router-dom'

const Header = ({ googleBtn }) => {
	const session = useSession()
	const navigate = useNavigate()

	return (
		<header className="header">
			<a className="header__logo">
				<img src={logo} alt="СурГУ Календарь" width="148" heihgt="30" />
			</a>
			<button className="menu-btn" onClick={e => googleBtn(e)}>
				<span className={`menu-btn__icon ${session ? 'menu-btn__icon--logout' : ''}`}></span>
			</button>
		</header>
	)
}

export default Header
