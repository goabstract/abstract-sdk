// @flow
import child_process from "child_process";
import nock from "nock";
import { Readable } from "readable-stream";
import { Client } from "../src";
import type { ShareDescriptor } from "./types";

function buildTextStream(text?: string): ReadableStream {
  const stream = new Readable();
  stream._read = () => {};

  if (text) {
    stream.push(text);
    stream.push(null);
  }

  return stream;
}

export const API_CLIENT = new Client({
  apiUrl: "http://api",
  transportMode: "api"
});

export const CLI_CLIENT = new Client({
  cliPath: ".",
  transportMode: "cli"
});

export function mockCLI(args: string[], response?: Object, error?: Object) {
  child_process.spawn.mockClear();
  child_process.spawn.mockReturnValueOnce({
    stdout: buildTextStream(JSON.stringify(response)),
    stderr: buildTextStream(JSON.stringify(error)),
    on: (name, cb) => {
      const callArgs = child_process.spawn.mock.calls[0][1].slice(-args.length);
      expect(callArgs).toEqual(args);
      setTimeout(() => {
        name === "error" && error && cb(1);
        name === "close" && !error && cb(0);
      });
    }
  });
}

export function mockAPI(url: string, response: Object, code: number = 200) {
  nock("http://api")
    .get(url)
    .reply(code, response);
}

export default function parseShareURL(url: string): ?string {
  return url.split("share.goabstract.com/")[1];
}

export function inferShareId(shareDescriptor: ShareDescriptor): string {
  let shareId;

  if (shareDescriptor.url) {
    shareId = parseShareURL(shareDescriptor.url);
  }

  if (shareDescriptor.shareId) {
    shareId = shareDescriptor.shareId;
  }

  if (!shareId) {
    throw new Error(
      `Could not infer share id from ShareDescriptor: "${JSON.stringify(
        shareDescriptor
      )}"`
    );
  }

  return shareId;
}
