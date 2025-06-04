import './_header.scss'
import logo from '../../img/logo-surgu-calendar.svg'
import { useSession } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@chakra-ui/react'

const Header = ({ googleBtn }) => {
	const session = useSession()
	const navigate = useNavigate()

	return (
		<header className="header gap-3">
			<a
				className="header__logo cursor-pointer"
				href="/"
				onClick={e => {
					e.preventDefault()
					navigate('/')
				}}>
				<img src={logo} alt="СурГУ Календарь" width="148" height="30" />
			</a>
			<div className="flex items-center gap-4">
				<span className="font-semibold !mb-[-4px]">{session?.user.user_metadata.full_name}</span>
				<Tooltip
					label={session ? 'Кнопка выхода' : 'При авторизации вы соглашаетесь с политикой конфиденциальности'}
					placement="bottom"
					hasArrow
					openDelay={300}>
					<button className="menu-btn" onClick={e => googleBtn(e)}>
						<span className={`menu-btn__icon ${session ? 'menu-btn__icon--logout' : ''}`}></span>
					</button>
				</Tooltip>
			</div>
		</header>
	)
}

export default Header
