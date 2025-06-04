import './_title.scss' // Подключаем стили

const Title = ({ children, title, position = 'left', className = '' }) => {
	// Определяем класс для позиционирования
	const getPositionClass = () => {
		switch (position) {
			case 'center':
				return 'text-center !mx-auto'
			case 'right':
				return 'text-right !ml-auto'
			default:
				return 'text-left !mr-auto'
		}
	}

	const renderTitle = () => {
		if (!title) return null

		return typeof title === 'string' ? (
			<h2 className={`title ${getPositionClass()} !px-[19px]`}>{title}</h2>
		) : (
			<div className={`title-wrapper ${getPositionClass()} !px-[19px] lg:!mx-auto lg:!text-center`}>{title}</div>
		)
	}

	return (
		<div className={`title-container ${className} !px-[10px]`}>
			{renderTitle()}
			{children}
		</div>
	)
}

export default Title
