export default class CustomError extends Error {
	constructor(message) {
		super(message)
		this.errorFormat = {
			title: this.message.split(';')[0],
			description: this.message.split(';')[1],
		}
	}
}
