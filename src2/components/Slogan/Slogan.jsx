import './_slogan.scss'

const Slogan = () => {
	return (
		<section className="page-main__slogan slogan">
			<h2 className="visually-hidden">Слоган СурГУ календаря</h2>
			<p className="slogan__h1">
				ПОПРОБУЙ
				<br />
				НОВОЕ
			</p>
			<p className="slogan__h2">
				расписание <span className="slogan__h2--color-first">Сур</span>
				<span className="slogan__h2--color-second">ГУ</span>
				<br />
				вместе с <span className="slogan__h2--text-en slogan__h2--color-first">Google</span>
				<span className="slogan__h2--text-en slogan__h2--color-second">Calendar</span>
			</p>
		</section>
	)
}

export default Slogan
