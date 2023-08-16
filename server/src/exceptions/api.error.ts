import { ValidationError } from "express-validator";

export class ApiError extends Error {
    status: number;
    errors: Array<ValidationError>;

    constructor(status: number, message: string, errors: Array<ValidationError> = []) {
        super(message)
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'User is not authorized')
    }

    static BadRequest(message: string, errors: Array<ValidationError> = []) {
        return new ApiError(400, message, errors)
    }
}