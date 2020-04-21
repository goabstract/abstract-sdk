/* @flow */
/* global fetch,window */
import { Readable } from "stream";
import "cross-fetch/polyfill";
import { spawn } from "child_process";
import uuid from "uuid/v4";
import { version } from "../../package.json";
import Client from "../Client";
import { inferShareId } from "../util/helpers";
import { log } from "../util/debug";
import {
  EndpointUndefinedError,
  MultiError,
  throwAPIError,
  throwCLIError
} from "../errors";
import type {
  ApiRequestOptions,
  CommandOptions,
  RequestConfig
} from "../types";

const cliPath = require("@elasticprojects/abstract-cli");
const logAPIRequest = log.extend("AbstractAPI:request");
const logAPIResponse = log.extend("AbstractAPI:response");
const logCLIRequest = log.extend("AbstractCLI:request");
const logCLIResponse = log.extend("AbstractCLI:response");
const minorVersion = version.split(".", 2).join(".");

// only attempt to use `performance` in a browser environment
/* istanbul ignore next */
const performance =
  typeof window === "undefined" ? undefined : window.performance;

export default class Endpoint {
  name: string;
  client: Client;
  options: CommandOptions;

  constructor(client: Client, options: CommandOptions) {
    this.client = client;
    this.options = options;
  }

  configureRequest<T>(requestName: string, config: RequestConfig<T>): T {
    const makeRequest = async () => {
      let response;
      const errors = {};
      const requestOptions = config.requestOptions || {};
      const transportMode =
        requestOptions.transportMode || this.options.transportMode;

      if (transportMode.length === 0) {
        throw new EndpointUndefinedError("any");
      }

      for (const mode of transportMode) {
        let requestError;
        try {
          const request = config[mode];
          if (!request) {
            throw new EndpointUndefinedError(mode);
          }

          let start: number;
          const { _analyticsCallback } = this.client;
          if (performance && _analyticsCallback) {
            start = performance.now();
          }

          const operation = request.call(this);
          response = await operation;

          if (start && performance && _analyticsCallback) {
            const end = performance.now();
            _analyticsCallback({
              duration: end - start,
              endpoint: this.name,
              request: requestName,
              transportMode: mode
            });
          }
        } catch (error) {
          requestError = error;
        }
        if (requestError) {
          errors[mode] = requestError;
        } else {
          break;
        }
      }

      if (Object.keys(errors).length === transportMode.length) {
        throw new MultiError(errors);
      }

      return response;
    };

    const response = makeRequest();
    return ((response: any): T);
  }

  async apiRequest(
    url: string,
    fetchOptions: Object = {},
    apiOptions: ApiRequestOptions = {}
  ) {
    const { customHostname, raw, onProgress } = apiOptions;
    const hostname = customHostname || (await this.options.apiUrl);

    fetchOptions.body = fetchOptions.body && JSON.stringify(fetchOptions.body);
    fetchOptions.headers = await this._getFetchHeaders(fetchOptions.headers);
    const args = [`${hostname}/${url}`, fetchOptions];

    /* istanbul ignore next */
    logAPIRequest.enabled && logAPIRequest(args);

    const response = await fetch(...args);
    !response.ok && (await throwAPIError(response, url, fetchOptions.body));
    if (response.status === 204) {
      return (undefined: any);
    }

    if (onProgress) {
      const totalSize = Number(response.headers.get("Content-Length"));
      let receivedSize = 0;
      const body = await response.body;
      // Node environments using cross-fetch polyfill
      /* istanbul ignore else */
      if (body instanceof Readable) {
        body.on("readable", () => {
          let chunk;
          while ((chunk = body.read())) {
            receivedSize += chunk.length;
            onProgress(receivedSize, totalSize);
          }
        });
        // Browser environments using native fetch
      } else if (body) {
        const reader = body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (value) {
            receivedSize += value.length;
            onProgress(receivedSize, totalSize);
          }
          if (done) {
            break;
          }
        }
      }
    }

    // prettier-ignore
    const apiValue: any = await (raw ? response.arrayBuffer() : response.json());
    const logValue = raw ? apiValue.toString() : apiValue;

    /* istanbul ignore next */
    logAPIResponse.enabled && logAPIResponse(logValue);

    return apiValue;
  }

  async cliRequest(args: string[]) {
    const token = await this._getAccessToken();
    const tokenArgs = typeof token === "string" ? ["--user-token", token] : [];

    const spawnArgs = [
      cliPath,
      [
        ...tokenArgs,
        "--api-url",
        await this.options.apiUrl,
        "--skip-network-read-ops",
        ...args
      ]
    ];

    /* istanbul ignore next */
    logCLIRequest.enabled && logCLIRequest(spawnArgs);

    return this._createStreamPromise(spawn(...spawnArgs), spawnArgs);
  }

  createCursor<T>(
    requestName: string,
    getConfig: (nextOffset?: number) => RequestConfig<any>,
    getValue: (response: any) => any
  ): T {
    const createPromise = lastPromise => {
      lastPromise = lastPromise || Promise.resolve();

      const promise = lastPromise.then(response => {
        if (response && !response.meta.nextOffset) {
          return;
        }

        return this.configureRequest<any>(
          requestName,
          getConfig(response && response.meta.nextOffset)
        );
      });

      const newPromise: any = promise.then<any>(
        response => response && getValue(response)
      );

      newPromise.next = () => {
        return createPromise(promise);
      };

      return newPromise;
    };

    return (createPromise(): T);
  }

  _createStreamPromise(response: any, spawnArgs: any[]) {
    return new Promise<any>((resolve, reject) => {
      let errBuffer = Buffer.from("");
      let outBuffer = Buffer.from("");

      response.stderr.on("data", chunk => {
        errBuffer = Buffer.concat([errBuffer, chunk]);
      });

      response.stdout.on("data", chunk => {
        outBuffer = Buffer.concat([outBuffer, chunk]);
      });

      response.on("error", reject);

      response.on("close", errCode => {
        if (errCode !== 0) {
          const response = JSON.parse(errBuffer.toString());
          try {
            throwCLIError(response, spawnArgs[0], { ...(spawnArgs[1]: any) });
          } catch (error) {
            reject(error);
          }
          return;
        }

        const cliResponse = JSON.parse(outBuffer.toString());

        /* istanbul ignore next */
        logCLIResponse.enabled && logCLIResponse(cliResponse);

        resolve(cliResponse);
      });
    });
  }

  async _getAccessToken() {
    return typeof this.options.accessToken === "function"
      ? this.options.accessToken()
      : this.options.accessToken;
  }

  async _getFetchHeaders(customHeaders?: { [key: string]: string }) {
    const token = await this._getAccessToken();
    const tokenHeader =
      typeof token === "string"
        ? { Authorization: `Bearer ${token}` }
        : { "Abstract-Share-Id": token && inferShareId(token) };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `Abstract SDK ${minorVersion}`,
      "X-Amzn-Trace-Id": `Root=1-${new Date().getTime()}-${uuid()}`,
      "Abstract-Api-Version": "8",
      ...tokenHeader,
      ...customHeaders
    };

    Object.keys(headers).forEach(key => {
      headers[key] === undefined && delete headers[key];
    });

    return headers;
  }
}
