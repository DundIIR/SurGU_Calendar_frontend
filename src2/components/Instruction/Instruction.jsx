import './_instruction.scss'
// import video from '../../video/instruction.mp4'
import poster from '../../img/poster1.svg'

const Instruction = () => {
	return (
		<section className='page-main__instruction instruction'>
			<h2 className='visually-hidden'>
				Видео-инструкция к использованию расписания
			</h2>
			<div className='instruction__video'>
				<video className='video' preload='auto' width='400px' poster={poster}>
					<source type='video/mp4' />
				</video>
				<button className='instruction__btn'>
					<span className='visually-hidden'>Запустить видео</span>
				</button>
			</div>
		</section>
	)
}

export default Instruction
