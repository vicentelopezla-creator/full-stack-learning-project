class AppError(Exception):
    status_code = 400
    detail = "Application error."

    def __init__(self, detail: str | None = None) -> None:
        if detail is not None:
            self.detail = detail
        super().__init__(self.detail)


class AuthenticationError(AppError):
    status_code = 401
    detail = "Invalid authentication credentials."


class AuthorizationError(AppError):
    status_code = 403
    detail = "You do not have permission to perform this action."


class ConflictError(AppError):
    status_code = 409
    detail = "Resource conflict."


class NotFoundError(AppError):
    status_code = 404
    detail = "Resource not found."


class ForbiddenError(AppError):
    status_code = 403
    detail = "You do not have access to this resource."
