// @flow
import Client from "./Client";
import * as sketch from "./sketch";
import {
  APITokenError,
  BaseError,
  CLIPathError,
  EndpointUndefinedError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
} from "./errors";

const errors = {
  APITokenError,
  CLIPathError,
  EndpointUndefinedError,
  Error: BaseError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
};

export { Client, errors, sketch };
export type * from "./types";
