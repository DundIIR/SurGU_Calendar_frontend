const Title = ({ children, title }) => {
	return (
		<>
			<div className="container flex flex-col gap-4 items-center justify-center">
				<h2 className="!ml-[] !mr-auto">Заголовок</h2>
				{children}
			</div>
		</>
	)
}

export default Title
