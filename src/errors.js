// @flow
import { log } from "./util/debug";
import type { ErrorData, ErrorMap } from "./types";

export const logAPIError = log.extend("AbstractAPI:error");
export const logCLIError = log.extend("AbstractCLI:error");

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor); // This is a Node API that helps stack trace readability
    }
  }
}

export class MultiError extends BaseError {
  errors: ErrorMap;

  constructor(errors: ErrorMap) {
    super("An error has occured");
    this.errors = errors;
  }
}

export class FileAPIError extends BaseError {
  constructor() {
    super(
      "This method requires an environment that supports the File API. See https://www.w3.org/TR/FileAPI/ for more information."
    );
  }
}

export class BranchSearchCLIError extends BaseError {
  constructor() {
    super(
      "This method requires a ProjectDescriptor when using the CLI transport."
    );
  }
}

export class EndpointUndefinedError extends BaseError {
  constructor(transport: string) {
    super(`Endpoint not defined in ${transport} transport.`);
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
      this.data.resetsAt = Number(resetSeconds) * 1000;
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

export class ValidationError extends BaseError {
  data: ErrorData;

  constructor(path: string, body: mixed) {
    super("Validation failed.");
    this.data = { path, body };
  }
}

export class FileExportError extends BaseError {
  constructor(fileId: string, exportId: string) {
    super(
      `File export failed for fileId ${fileId} and export jobId ${exportId}.`
    );
  }
}

export async function throwAPIError(
  response: Response,
  url: string,
  body: mixed
) {
  /* istanbul ignore next */
  logAPIError.enabled && logAPIError(await response.clone().json());

  switch (response.status) {
    case 401:
      throw new UnauthorizedError(url, body);
    case 403:
      throw new ForbiddenError(url, body);
    case 404:
      throw new NotFoundError(url, body);
    case 422:
      throw new ValidationError(url, body);
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

export function throwCLIError(
  response: { code: string, message: string },
  cliPath: string,
  args: Object
) {
  /* istanbul ignore next */
  logCLIError.enabled && logCLIError(response);

  switch (response.code) {
    case "unauthorized":
      throw new UnauthorizedError(cliPath, args);
    case "forbidden":
      throw new ForbiddenError(cliPath, args);
    case "not_found":
      throw new NotFoundError(cliPath, args);
    case "too_many_requests":
      throw new RateLimitError(cliPath, args);
    case "service_unavailable":
      throw new ServiceUnavailableError(cliPath, args);
    case "validation_error":
      throw new ValidationError(cliPath, args);
    default:
      throw new Error(response.message);
  }
}
