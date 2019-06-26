// @flow
/* istanbul ignore file */
import child_process from "child_process";
import nock from "nock";
import { Readable } from "readable-stream";
import Client from "./Client";

jest.mock("child_process");

function buildTextStream(text?: string): ReadableStream {
  const stream = new Readable();
  stream._read = () => {};

  if (text) {
    stream.push(text);
    stream.push(null);
  }

  return stream;
}

export const DEFAULT_CLIENT = new Client();

export const API_CLIENT = new Client({
  accessToken: "accessToken",
  apiUrl: "http://apiUrl",
  previewsUrl: "http://previewsUrl",
  transportMode: "api"
});

export const CLI_CLIENT = new Client({
  accessToken: "accessToken",
  apiUrl: "http://apiUrl",
  cliPath: ".",
  previewsUrl: "http://previewsUrl",
  transportMode: "cli"
});

export const API_CLIENT_CACHED = new Client({
  accessToken: "accessToken",
  apiUrl: "http://apiUrl",
  maxCacheSize: 10,
  previewsUrl: "http://previewsUrl",
  transportMode: "api"
});

export const CLI_CLIENT_CACHED = new Client({
  accessToken: "accessToken",
  apiUrl: "http://apiUrl",
  cliPath: ".",
  maxCacheSize: 10,
  previewsUrl: "http://previewsUrl",
  transportMode: "cli"
});

export function mockCLI(
  args: string[],
  response?: Object | Array<Object>,
  error?: Object
) {
  (child_process.spawn: any).mockClear();
  (child_process.spawn: any).mockReturnValueOnce({
    stdout: buildTextStream(JSON.stringify(response)),
    stderr: buildTextStream(JSON.stringify(error)),
    on: (name, cb) => {
      const callArgs = (child_process.spawn: any).mock.calls[0][1].slice(
        -args.length
      );

      expect(callArgs).toEqual(args);
      setTimeout(() => {
        name === "error" && error && cb(1);
        name === "close" && !error && cb(0);
      });
    }
  });
}

export function mockAPI(
  url: string,
  response: Object,
  code: number = 200,
  method: string = "get"
) {
  (nock("http://apiUrl"): any)[method](url).reply(code, response);
}

export function mockPreviewAPI(
  url: string,
  response: Object,
  code: number = 200,
  method: string = "get"
) {
  (nock("http://previewsurl"): any)[method](url).reply(code, response);
}
