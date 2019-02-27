/* @flow */
/* global fetch */
import "cross-fetch/polyfill";
import path from "path";
import { existsSync } from "fs";
import { spawn } from "child_process";
import uuid from "uuid/v4";
import Client from "../Client";
import { inferShareId } from "../utils";
import { log } from "../debug";
import { version } from "../../package.json";
import {
  APITokenError,
  CLIPathError,
  EndpointUndefinedError,
  logAPIError,
  logCLIError,
  throwAPIError,
  throwCLIError
} from "../errors";
import type { AccessToken, AccessTokenOption, CommandOptions } from "../types";

const logAPIRequest = log.extend("AbstractAPI:request");
const logAPIResponse = log.extend("AbstractAPI:response");
const logCLIRequest = log.extend("AbstractCLI:request");
const logCLIResponse = log.extend("AbstractCLI:response");
const minorVersion = version.split(".", 2).join(".");

export type EndpointHandler<T> = {
  api?: () => T,
  cli?: () => T
};

export default class Endpoint {
  _optionAccessToken: ?AccessTokenOption;
  apiUrl: string;
  cliPath: ?string;
  client: Client;
  lastCalledEndpoint: ?string;
  previewsUrl: string;
  transportMode: string;
  webUrl: string;

  accessToken = async (): Promise<AccessToken> =>
    typeof this._optionAccessToken === "function"
      ? this._optionAccessToken()
      : this._optionAccessToken;

  constructor(client: Client, options: CommandOptions) {
    this._optionAccessToken = options.accessToken;
    this.apiUrl = options.apiUrl;
    this.cliPath = options.cliPath && path.resolve(options.cliPath);
    this.client = client;
    this.previewsUrl = options.previewsUrl;
    this.transportMode = options.transportMode;
    this.webUrl = options.webUrl;
  }

  request<T>(handler: EndpointHandler<T>): T {
    if (this.transportMode === "auto") {
      // TODO: Check if CLI is available
      if (handler.cli) {
        return handler.cli();
      }

      // TODO: Check if API is online
      if (handler.api) {
        return handler.api();
      }

      throw new EndpointUndefinedError(
        this.lastCalledEndpoint,
        this.transportMode
      );
    }

    if (handler[this.transportMode]) {
      return handler[this.transportMode]();
    }

    throw new EndpointUndefinedError(
      this.lastCalledEndpoint,
      this.transportMode
    );
  }

  async apiRequest(
    input: string,
    init: Object = {},
    hostname: ?string = this.apiUrl
  ) {
    const response = await this._fetch(input, init, hostname);
    const data = await response.json();
    logAPIResponse.enabled && logAPIResponse(data);
    return data;
  }

  async apiRawRequest(
    input: string,
    init: Object = {},
    hostname: ?string = this.apiUrl
  ) {
    const response = await this._fetch(input, init, hostname);
    const buffer = response.arrayBuffer();
    logAPIResponse.enabled && logAPIResponse(buffer.toString());
    return buffer;
  }

  async cliRequest(args: string[]) {
    const token = await this.accessToken();
    const tokenArgs = typeof token === "string" ? ["--user-token", token] : [];

    if (!this.cliPath || !existsSync(this.cliPath)) {
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

  async _fetch(
    input: string,
    init: Object = {},
    hostname: ?string = this.apiUrl
  ) {
    if (init.body) {
      init.body = JSON.stringify(init.body);
    }
    init.headers = await this._getAPIHeaders(init.headers);
    const args = [
      hostname === null ? input : `${hostname || ""}/${input}`,
      init
    ];
    logAPIRequest.enabled && logAPIRequest(args);

    const request = fetch(...args);
    const response = await request;
    !response.ok && (await throwAPIError(response, input, init.body));
    return response;
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

    const tokens = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `Abstract SDK ${minorVersion}`,
      "X-Amzn-Trace-Id": `Root=1-${new Date().getTime()}-${uuid()}`,
      "Abstract-Api-Version": "8",
      ...tokenHeader,
      ...headers
    };
    Object.keys(tokens).forEach(key => {
      tokens[key] === undefined && delete tokens[key];
    });
    return tokens;
  }
}
