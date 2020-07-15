// @flow
/* istanbul ignore file */
import child_process from "child_process";
import nock from "nock";
import { Readable } from "readable-stream";
import Client from "../Client";

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

export const CLIENT_CONFIG = {
  accessToken: "accessToken",
  apiUrl: "http://apiUrl",
  objectUrl: "http://objectUrl",
  previewUrl: "http://previewUrl"
};

export const DEFAULT_CLIENT = new Client();

export const API_CLIENT = new Client({
  ...CLIENT_CONFIG,
  transportMode: ["api"]
});

export const CLI_CLIENT = new Client({
  ...CLIENT_CONFIG,
  transportMode: ["cli"]
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
        name === "close" && error && cb(1);
        name === "close" && !error && cb(0);
      });
    }
  });
  return child_process.spawn;
}

export function mockAPI(
  url: string,
  response: Object,
  code: number = 200,
  method: string = "get"
) {
  (nock("http://apiurl"): any)[method](url).reply(code, response);
}

export function mockAuth(
  url: string,
  response: Object,
  code: number = 200,
  method: string = "get"
) {
  (nock("https://auth.goabstract.com"): any)[method](url).reply(code, response);
}

export function mockPreviewAPI(
  url: string,
  response: Object,
  code: number = 200,
  method: string = "get"
) {
  (nock("http://previewurl"): any)[method](url).reply(code, response);
}

export function mockObjectAPI(
  url: string,
  response: Object,
  code: number = 200,
  method: string = "get"
) {
  const base = (nock("http://objecturl"): any).replyContentLength();
  base[method](url).reply(code, response);
}
