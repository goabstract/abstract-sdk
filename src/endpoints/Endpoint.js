/* @flow */
/* global fetch */
/* istanbul ignore file */
import "cross-fetch/polyfill";
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

export type CacheConfiguration = {
  disable?: boolean,
  key: string
};

export type EndpointRequest<T> = {
  api?: () => T,
  cli?: () => T,
  cache?: CacheConfiguration
};

export default class Endpoint {
  _optionAccessToken: ?AccessTokenOption;
  apiUrl: string | Promise<string>;
  cliPath: ?string | Promise<?string>;
  client: Client;
  lastCalledEndpoint: ?string;
  maxCacheSize: number;
  previewsUrl: string | Promise<string>;
  transportMode: string;
  webUrl: string | Promise<string>;

  accessToken = async (): Promise<AccessToken> =>
    typeof this._optionAccessToken === "function"
      ? this._optionAccessToken()
      : this._optionAccessToken;

  constructor(client: Client, options: CommandOptions) {
    this._optionAccessToken = options.accessToken;
    this.apiUrl = options.apiUrl;
    this.cliPath = options.cliPath;
    this.client = client;
    this.maxCacheSize = options.maxCacheSize;
    this.previewsUrl = options.previewsUrl;
    this.transportMode = options.transportMode;
    this.webUrl = options.webUrl;
  }

  request<T>(request: EndpointRequest<T>): T {
    let response;

    if (request.cache) {
      const existingEntity = this.client.cache.get(request.cache.key);
      if (existingEntity) {
        return existingEntity;
      }
    }

    if (this.transportMode === "auto") {
      if (request.cli) {
        response = request.cli();
      } else if (request.api) {
        response = request.api();
      } else {
        throw new EndpointUndefinedError(
          this.lastCalledEndpoint,
          this.transportMode
        );
      }
    } else if (request[this.transportMode]) {
      const handler = request[this.transportMode];
      response = handler();
    } else {
      throw new EndpointUndefinedError(
        this.lastCalledEndpoint,
        this.transportMode
      );
    }

    if (request.cache && this.maxCacheSize > 0 && !request.cache.disable) {
      this.client.cache.set(request.cache.key, response);

      if (this.client.cache.size > this.maxCacheSize) {
        const oldestEntity = this.client.cache.keys().next().value;
        oldestEntity && this.client.cache.delete(oldestEntity);
      }
    }

    return response;
  }

  async apiRequest(
    input: string,
    init: Object = {},
    overrideHostname?: ?string
  ) {
    const hostname =
      overrideHostname !== undefined ? overrideHostname : await this.apiUrl;
    const response = await this._fetch(input, init, hostname);
    const data = await response.json();
    /* istanbul ignore next */
    logAPIResponse.enabled && logAPIResponse(data);
    return data;
  }

  async apiRawRequest(
    input: string,
    init: Object = {},
    overrideHostname?: ?string
  ) {
    const hostname =
      overrideHostname !== undefined ? overrideHostname : await this.apiUrl;
    const response = await this._fetch(input, init, hostname);
    const buffer = response.arrayBuffer();
    /* istanbul ignore next */
    logAPIResponse.enabled && logAPIResponse(buffer.toString());
    return buffer;
  }

  async cliRequest(args: string[]) {
    const token = await this.accessToken();
    const cliPath = await this.cliPath;
    const tokenArgs = typeof token === "string" ? ["--user-token", token] : [];

    if (!cliPath || !existsSync(cliPath)) {
      const error = new CLIPathError();
      /* istanbul ignore next */
      logCLIError.enabled && logCLIError(error);
      throw error;
    }

    const spawnArgs = [
      cliPath,
      [...tokenArgs, "--api-url", await this.apiUrl, ...args]
    ];

    /* istanbul ignore next */
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
        /* istanbul ignore next */
        logCLIResponse.enabled && logCLIResponse(response);
        resolve(response);
      });
    });
  }

  async _fetch(input: string, init: Object = {}, hostname: ?string) {
    if (init.body) {
      init.body = JSON.stringify(init.body);
    }
    init.headers = await this._getAPIHeaders(init.headers);
    const args = [
      hostname === null ? input : `${hostname || ""}/${input}`,
      init
    ];
    /* istanbul ignore next */
    logAPIRequest.enabled && logAPIRequest(args);

    const request = fetch(...args);
    const response = await request;
    !response.ok && (await throwAPIError(response, input, init.body));
    return response;
  }

  async _getAPIHeaders(headers?: {}) {
    let tokenHeader = {};
    const token = await this.accessToken();

    if (!token) {
      const error = new APITokenError();
      /* istanbul ignore next */
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
