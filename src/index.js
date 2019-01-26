// @flow
import client from "./Client";
import * as Sketch from "./sketch";
import * as TRANSPORTS from "./transports";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
} from "./errors";

const errors = {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
};

export { client, errors, Sketch, TRANSPORTS };
export { client as Client }; // Deprecated: prefer Abstract.client factory
export type * from "./types";
