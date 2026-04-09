"use strict";

const StatusCode = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL: 500,
};

const ReasonStatusCode = {
  BAD_REQUEST: "Bad Request",
  FORBIDDEN: "Forbidden",
  CONFLICT: "Conflict",
  INTERNAL: "Internal",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.CONFLICT,
  ) {
    super(message, status);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    status = StatusCode.FORBIDDEN,
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    status = StatusCode.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL,
    status = StatusCode.INTERNAL,
  ) {
    super(message, status);
  }
}

module.exports = {
  BadRequestError,
  ForbiddenRequestError,
  ConflictRequestError,
  InternalServerError,
};
