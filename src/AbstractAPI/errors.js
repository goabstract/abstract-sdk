// @flow
import { log } from "../debug";

const logStatusError = log.extend("AbstractAPI:status:error");

type ErrorData = {|
  url: string,
  body: mixed
|};

class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends BaseError {
  data: ErrorData;

  constructor(url: string, body: mixed) {
    super("Internal server error.");
    this.data = { url, body };
  }
}

export class NotFoundError extends BaseError {
  data: ErrorData;

  constructor(url: string, body: mixed) {
    super("Not found.");
    this.data = { url, body };
  }
}

export class RateLimitError extends BaseError {
  data: {
    ...ErrorData,
    resetsAt: ?number,
    retryIn: ?number
  };

  constructor(url: string, body: mixed, response: Response) {
    const resetSeconds = response.headers.get("ratelimit-reset");
    const resetsAt = Number(resetSeconds && Number(resetSeconds) * 1000);
    const retryIn = resetsAt && resetsAt - Date.now();
    super("Too many requests.");
    this.data = { url, body, resetsAt, retryIn };
  }
}

export class UnauthorizedError extends BaseError {
  data: ErrorData;

  constructor(url: string, body: mixed) {
    super("Unauthorized.");
    this.data = { url, body };
  }
}

export class ForbiddenError extends BaseError {
  data: ErrorData;

  constructor(url: string, body: mixed) {
    super("Forbidden.");
    this.data = { url, body };
  }
}

export async function catchError(
  response: Response,
  url: string,
  init: Object
) {
  if (response.ok) return;

  if (logStatusError.enabled) {
    logStatusError(await response.clone.json());
  }

  switch (response.status) {
    case 401:
      throw new UnauthorizedError(url, init.body);
    case 403:
      throw new ForbiddenError(url, init.body);
    case 404:
      throw new NotFoundError(url, init.body);
    case 429:
      throw new RateLimitError(url, init.body, response);
    case 500:
      throw new InternalServerError(url, init.body);
    default:
      throw new Error(`Received status "${response.status}", expected 2XX`);
  }
}
