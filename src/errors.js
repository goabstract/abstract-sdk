// @flow
import { log } from "./debug";

const logAPIError = log.extend("AbstractAPI:status:error");
const logCLIError = log.extend("AbstractCLI:status:error");

type ErrorData = {|
  path: string,
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

  constructor(path: string, body: mixed) {
    super("Internal server error.");
    this.data = { path, body };
  }
}

export class NotFoundError extends BaseError {
  data: ErrorData;

  constructor(path: string, body: mixed) {
    super("Not found.");
    this.data = { path, body };
  }
}

export class RateLimitError extends BaseError {
  data: {
    ...ErrorData,
    resetsAt?: number
  };

  constructor(path: string, body: mixed, response?: Response) {
    super("Too many requests.");
    this.data = { path, body };
    if (response) {
      const resetSeconds = response.headers.get("ratelimit-reset");
      const resetsAt = Number(resetSeconds && Number(resetSeconds) * 1000);
      this.data.resetsAt = resetsAt;
    }
  }
}

export class UnauthorizedError extends BaseError {
  data: ErrorData;

  constructor(path: string, body: mixed) {
    super("Unauthorized.");
    this.data = { path, body };
  }
}

export class ForbiddenError extends BaseError {
  data: ErrorData;

  constructor(path: string, body: mixed) {
    super("Forbidden.");
    this.data = { path, body };
  }
}

export class ServiceUnavailableError extends BaseError {
  data: ErrorData;

  constructor(path: string, body: mixed) {
    super("Service unavailable.");
    this.data = { path, body };
  }
}

export async function catchAPIError(
  response: Response,
  url: string,
  body: mixed
) {
  if (logAPIError.enabled) {
    logAPIError(await response.clone.json());
  }

  switch (response.status) {
    case 401:
      throw new UnauthorizedError(url, body);
    case 403:
      throw new ForbiddenError(url, body);
    case 404:
      throw new NotFoundError(url, body);
    case 429:
      throw new RateLimitError(url, body, response);
    case 500:
      throw new InternalServerError(url, body);
    case 503:
      throw new ServiceUnavailableError(url, body);
    default:
      throw new Error(`Received status "${response.status}", expected 2XX`);
  }
}

export async function catchCLIError(
  response: { code: string, message: string },
  cliPath: string,
  args: Object,
  reject: (reason?: any) => void
) {
  if (logCLIError.enabled) {
    logCLIError(response);
  }

  switch (response.code) {
    case "unauthorized":
      reject(new UnauthorizedError(cliPath, args));
      break;
    case "forbidden":
      reject(new ForbiddenError(cliPath, args));
      break;
    case "not_found":
      reject(new NotFoundError(cliPath, args));
      break;
    case "too_many_requests":
      reject(new RateLimitError(cliPath, args));
      break;
    case "service_unavailable":
      reject(new ServiceUnavailableError(cliPath, args));
      break;
    default:
      reject(new Error("An unexpected error has occurred."));
  }
}
