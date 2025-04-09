import { useSession } from '@supabase/auth-helpers-react'
import './_fileScheduleItem.scss'

const FileScheduleItem = ({ title, onOpen, setTitle }) => {
	const session = useSession()

	const handleClick = () => {
		setTitle(title)
		onOpen()
	}

	return (
		<li
			className="file-schedule__item"
			onClick={() => {
				handleClick()
			}}>
			<p className="file-schedule__title">{title.length > 24 ? title.slice(0, 21) + '...' : title}</p>
			<div className="file-schedule__icon">
				{session ? (
					<svg width="36" height="36" viewBox="0 0 36 36">
						<path fill="#34A853" d="M16 16v14h4V20z"></path>
						<path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
						<path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
						<path fill="#EA4335" d="M20 16V6h-4v14z"></path>
						<path fill="none" d="M0 0h36v36H0z"></path>
					</svg>
				) : (
					<svg className="file-schedule__svg" width="27" height="34" viewBox="0 0 27 34" fill="none">
						<path
							d="M8 23.9245L8 26.017C8 26.3342 8.12553 26.6383 8.34898 26.8625C8.57243 27.0868 8.87549 27.2128 9.19149 27.2128H16.3404C16.6564 27.2128 16.9595 27.0868 17.1829 26.8625C17.4064 26.6383 17.5319 26.3342 17.5319 26.017V23.9245M12.7666 17V23.7759M12.7666 23.7759L15.49 21.1868M12.7666 23.7759L10.0432 21.1868"
							stroke="#484848"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M15.2979 1V9C15.2979 10.1046 16.2124 11 17.3404 11H25.5106M15.6483 1H5.08511C2.82896 1 1 2.79086 1 5V29C1 31.2091 2.82897 33 5.08511 33H21.4255C23.6817 33 25.5106 31.2091 25.5106 29V10.6569C25.5106 9.59599 25.0802 8.57857 24.3141 7.82843L18.5369 2.17157C17.7708 1.42143 16.7318 1 15.6483 1Z"
							stroke="#484848"
							strokeWidth="2"
						/>
					</svg>
				)}
			</div>
		</li>
	)
}

export default FileScheduleItem
