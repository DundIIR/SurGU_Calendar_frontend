import { Link } from 'react-router-dom'
import notFoundImage from '../img/404.svg'

const NotFoundPage = () => {
	return (
		<div className="flex flex-col items-center justify-start  gap-5 !p-4 !ml-[-5px] text-center !overflow-hidden">
			<div className="w-full max-w-[750px] min-w-[250px] mx-auto mb-8">
				<img src={notFoundImage} alt="Страница не найдена" className="w-full h-auto object-contain" />
			</div>

			<Link
				to="/"
				className="bg-black text-white !px-6 !py-3 rounded-lg hover:bg-gray-800 transition-colors text-base md:text-lg">
				Вернуться на главную
			</Link>
		</div>
	)
}

export default NotFoundPage
