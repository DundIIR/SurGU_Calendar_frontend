export default class CustomError extends Error {
	constructor(error, details, status) {
		super(error)
		this.status = status
		this.details = details
	}
}
