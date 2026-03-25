import { FlowdockApiError } from "./flowdock-error";

export class UnauthorizedError extends FlowdockApiError {
  constructor(message = "Unauthorized. Please sign in to continue.") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends FlowdockApiError {
  constructor(message = "Forbidden. Access denied.") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends FlowdockApiError {
  constructor(message = "Resource not found.") {
    super(404, message, "NOT_FOUND");
  }
}

export class ValidationError extends FlowdockApiError {
  constructor(message = "Invalid request data.") {
    super(422, message, "VALIDATION_ERROR");
  }
}

export class ConflictError extends FlowdockApiError {
  constructor(message = "Conflict. Resource already exists.") {
    super(409, message, "CONFLICT");
  }
}

export class InternalServerError extends FlowdockApiError {
  constructor(message = "Internal server error.") {
    super(500, message, "INTERNAL_SERVER_ERROR");
  }
}
