// @flow
import Client from "./Client";
import paginate from "./paginate";
import * as sketch from "./sketch";
import {
  APITokenError,
  BaseError,
  CLIPathError,
  EndpointUndefinedError,
  ForbiddenError,
  InternalServerError,
  LatestCommitNotFound,
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
  LatestCommitNotFound,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
};

export { Client, errors, paginate, sketch };
export type * from "./types";
