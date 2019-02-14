/* @flow */
/* global fetch */
import "isomorphic-fetch";
import path from "path";
import { spawn } from "child_process";
import uuid from "uuid/v4";
import { inferShareId } from "../utils";
import { log } from "../debug";
import {
  APITokenError,
  CLIPathError,
  MethodUndefinedError,
  logAPIError,
  logCLIError,
  throwAPIError,
  throwCLIError
} from "../errors";
import { version } from "../../package.json";
import type { AccessToken, AccessTokenOption, CommandOptions } from "../types";

const logAPIRequest = log.extend("AbstractAPI:request");
const logAPIResponse = log.extend("AbstractAPI:response");
const logCLIRequest = log.extend("AbstractCLI:request");
const logCLIResponse = log.extend("AbstractCLI:response");
const minorVersion = version.split(".", 2).join(".");

export type EndpointHandler<T> = {
  api?: () => Promise<T>,
  cli?: () => Promise<T>
};

export default class BaseEndpoint {
  _optionAccessToken: ?AccessTokenOption;
  apiUrl: string;
  cliPath: ?string;
  previewsUrl: string;
  transportMode: string;

  accessToken = async (): Promise<AccessToken> =>
    typeof this._optionAccessToken === "function"
      ? this._optionAccessToken()
      : this._optionAccessToken;

  constructor(options: CommandOptions) {
    this.cliPath = options.cliPath && path.resolve(options.cliPath);
    this._optionAccessToken = options.accessToken;
    this.apiUrl = options.apiUrl;
    this.previewsUrl = options.previewsUrl;
    this.transportMode = options.transportMode;
  }

  request<T>(handler: EndpointHandler<T>): Promise<T> {
    if (this.transportMode === "auto") {
      // TODO: Check if CLI is available
      if (handler.cli) {
        return handler.cli();
      }

      // TODO: Check if API is online
      if (handler.api) {
        return handler.api();
      }

      throw new MethodUndefinedError();
    }

    if (handler[this.transportMode]) {
      return handler[this.transportMode]();
    }

    throw new MethodUndefinedError(this.transportMode);
  }

  async apiRequest<T>(
    input: string,
    init: Object = {},
    hostname: ?string = this.apiUrl
  ): Promise<T> {
    init.body = init.body && JSON.stringify(init.body);
    init.headers = await this._getAPIHeaders(init.headers);
    const args = [
      hostname === null ? input : `${hostname || ""}/${input}`,
      init
    ];
    logAPIRequest.enabled && logAPIRequest(args);

    const request = fetch(...args);
    const response = await request;
    !response.ok && (await throwAPIError(response, input, init.body));

    const data = await response.json();
    logAPIResponse.enabled && logAPIResponse(data);
    return data;
  }

  async cliRequest<T>(args: string[]): Promise<T> {
    const token = await this.accessToken();
    const tokenArgs = typeof token === "string" ? ["--user-token", token] : [];

    if (!this.cliPath) {
      const error = new CLIPathError();
      logCLIError.enabled && logCLIError(error);
      throw error;
    }

    const spawnArgs = [
      this.cliPath,
      [...tokenArgs, "--api-url", this.apiUrl, ...args]
    ];

    logCLIRequest.enabled && logCLIRequest(spawnArgs);
    const request = spawn(...spawnArgs);

    return new Promise((resolve, reject) => {
      let errBuffer = Buffer.from("");
      let outBuffer = Buffer.from("");

      request.stderr.on("data", chunk => {
        errBuffer = Buffer.concat([errBuffer, chunk]);
      });

      request.stdout.on("data", chunk => {
        outBuffer = Buffer.concat([outBuffer, chunk]);
      });

      request.on("error", reject);
      request.on("close", errCode => {
        if (errCode !== 0) {
          const response = JSON.parse(errBuffer.toString());
          try {
            throwCLIError(response, spawnArgs[0], { ...(spawnArgs[1]: any) });
          } catch (error) {
            reject(error);
          }
          return;
        }

        const response = JSON.parse(outBuffer.toString());
        logCLIResponse.enabled && logCLIResponse(response);
        resolve(response);
      });
    });
  }

  async _getAPIHeaders(headers?: Object) {
    let tokenHeader = {};
    const token = await this.accessToken();

    if (!token) {
      const error = new APITokenError();
      logAPIError.enabled && logAPIError(error);
      throw error;
    }

    if (token) {
      tokenHeader =
        typeof token === "string"
          ? { Authorization: `Bearer ${token}` }
          : { "Abstract-Share-Id": inferShareId(token) };
    }

    const definedHeaders = {};
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `Abstract SDK ${minorVersion}`,
      "X-Amzn-Trace-Id": `Root=1-${new Date().getTime()}-${uuid()}`,
      "Abstract-Api-Version": "8",
      ...tokenHeader,
      ...headers
    };
    for (const key in headers) {
      headers[key] !== undefined && (definedHeaders[key] = headers[key]);
    }

    return definedHeaders;
  }
}
