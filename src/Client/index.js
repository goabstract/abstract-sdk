// @flow
import type { AbstractInterface, AccessTokenOption } from "../";
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
  const { apiUrl, cliPath, previewsUrl } = options;

  if (!Transport) {
    throw new Error("options.transport is required");
  }

  return new Transport({ accessToken, cliPath, apiUrl, previewsUrl });
}
