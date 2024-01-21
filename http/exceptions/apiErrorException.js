export default class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);

        this.status = status;
        this.errors = errors;
    }

    static BadRequestError = (message, errors = []) => {
        return new ApiError(500, message, errors);
    }

    static ValidationError = (errors = []) => {
        return new ApiError(400, "Validation errors !", errors);
    }

    static UnauthorizedError = () => {
        return new ApiError(401, "The user is not authorized !");
    }
}