// @flow
/* istanbul ignore file */
import Client from "./Client";
import { inferShareId } from "./util/helpers";
import { paginate } from "./paginate";
import * as sketch from "./sketch";
import {
  BaseError,
  EndpointUndefinedError,
  FileAPIError,
  FileExportError,
  ForbiddenError,
  InternalServerError,
  MultiError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
} from "./errors";

export {
  // Core API
  Client,
  // Custom errors
  BaseError,
  EndpointUndefinedError,
  FileAPIError,
  FileExportError,
  ForbiddenError,
  InternalServerError,
  MultiError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError,
  // Utilities
  inferShareId,
  paginate,
  sketch
};

export type * from "./types";
