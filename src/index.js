// @flow
import Client from "./Client";
import * as sketch from "./sketch";
import {
  APITokenError,
  BaseError,
  CLIPathError,
  ForbiddenError,
  InternalServerError,
  MethodUndefinedError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
} from "./errors";

const errors = {
  APITokenError,
  CLIPathError,
  Error: BaseError,
  ForbiddenError,
  InternalServerError,
  MethodUndefinedError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
};

export { Client, errors, sketch };
export type * from "./types";
