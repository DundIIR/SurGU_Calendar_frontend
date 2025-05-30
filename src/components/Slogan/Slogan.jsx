import SearchForm from '../SearchForm/SearchForm'
import Title from '../Title/Title'
import './_slogan.scss'

const Slogan = ({ admin }) => {
	return admin ? (
		<section className="slogan">
			<h1 className="slogan__title">
				Добро пожаловать в
				<br />
				<span className="slogan__highlight slogan__highlight--blue"> Админ-панель</span>
				{/* <span className="slogan__highlight slogan__highlight--green"> СурГУ календаря</span> */}
			</h1>
			<Title>
				<SearchForm></SearchForm>
			</Title>
		</section>
	) : (
		<section className="slogan">
			<p className="slogan__badge">
				полностью бесплатно,
				<br />
				добавь за 3 минуты
			</p>
			<h1 className="slogan__title">
				Попробуй новое расписание<span className="slogan__highlight slogan__highlight--blue"> СурГУ</span> с
				<span className="slogan__highlight slogan__highlight--green"> GoogleCalendar</span>
			</h1>
			<p className="slogan__subtitle">вводи свою группу с подгруппой или фамилию преподавателя</p>
			<SearchForm></SearchForm>
		</section>
	)
}

export default Slogan
