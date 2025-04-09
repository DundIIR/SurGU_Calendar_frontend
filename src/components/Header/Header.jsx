import './_header.scss'
import logo from '../../img/logo-surgu-calendar.svg'

const Header = () => {
	return (
		<header className="header">
			<a className="header__logo">
				<img src={logo} alt="СурГУ Календарь" width="148" heihgt="30" />
			</a>
			<button className="menu-btn">
				<span className="menu-btn__icon"></span>
			</button>
		</header>
	)
}

export default Header
