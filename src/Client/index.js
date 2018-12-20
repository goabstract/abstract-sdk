// @flow
import type { AbstractInterface, AccessTokenOption } from "../types";
import { AUTO } from "../transports";

type Options = {
  accessToken?: AccessTokenOption,
  cliPath?: string[],
  apiUrl?: string,
  previewsUrl?: string,
  transport?: *
};

export default function Client(options: Options = {}): AbstractInterface {
  const Transport = options.transport || AUTO;
  const accessToken = options.accessToken || process.env.ABSTRACT_TOKEN;

  if (!Transport) {
    throw new Error("options.transport is required");
  }

  return new Transport({
    accessToken,
    cliPath: options.cliPath,
    apiUrl: options.apiUrl,
    previewsUrl: options.previewsUrl
  });
}
