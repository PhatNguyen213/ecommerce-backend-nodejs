"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    status = StatusCode.OK,
    reason = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reason : message;
    this.status = status;
    this.reason = reason;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    res.status(this.status).json(this);
  }
}

class OKResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      status: StatusCode.CREATED,
      reason: ReasonStatusCode.OK,
      metadata,
    });
  }
}

module.exports = { OKResponse, CreatedResponse };
