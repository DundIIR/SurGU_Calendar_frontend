import './_header.scss'
import logo from '../../img/Logo_SurGU_Calendar.svg'
import FormSearch from '../FormSearch/FormSearch'
import UserList from '../UserList/UserList'

const Header = ({ googleBtn, updateSchedule }) => {
	return (
		<header className="header">
			<div className="header__wrapper">
				<a className="header__logo" href="#">
					<img src={logo} alt="СурГУ Календарь" width="242" height="58" />
				</a>
				<FormSearch updateSchedule={updateSchedule} />
				<UserList googleBtn={googleBtn} />
			</div>
		</header>
	)
}

export default Header
