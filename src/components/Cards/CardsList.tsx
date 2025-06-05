import './_cards-list.scss'
import googleLogo from '../../img/logo-google.svg'
import yandexLogo from '../../img/logo-yandex.svg'
import appleLogo from '../../img/logo-apple.svg'

const CardsList = () => {
	const cards = [
		{
			id: 1,
			title: 'Google Calendar',
			description: 'Интегрируйте расписание в самый популярный календарь с удобными напоминаниями',
			logo: googleLogo,
			link: '/integration/google',
			mode: 'google',
		},
		{
			id: 2,
			title: 'Yandex Calendar',
			description: 'Добавьте расписание в календарь Яндекса с синхронизацией на всех устройствах',
			logo: yandexLogo,
			link: '/integration/yandex',
			mode: 'yandex',
		},
		{
			id: 3,
			title: 'IOS - Calendar',
			description: 'Импортируйте расписание в стандартное приложение календаря на устройствах Apple',
			logo: appleLogo,
			link: '/integration/apple',
			mode: 'apple',
		},
	]

	return (
		<section className="!px-2">
			<div className="flex flex-col xl:flex-row justify-between gap-10 items-center">
				{cards.map(card => (
					<div className="card-wrapper" key={card.id}>
						<a
							href={card.link}
							className="calendar-card"
							onClick={e => {
								e.preventDefault()
								// Здесь можно добавить логику перехода
								window.location.href = card.link
							}}>
							<div className={`card-logo card-logo--${card.mode}`}>
								<img src={card.logo} alt={`${card.title} лого`} />
							</div>
							<h3 className={`card-title card-title--${card.mode}`}>{card.title}</h3>
							<p className="card-description">{card.description}</p>
							<div className="card-link">Инструкция по подключению →</div>
						</a>
					</div>
				))}
			</div>
		</section>
	)
}

export default CardsList
