// @flow
import type { AbstractInterface } from "../";
import { AUTO } from "../transports";

type Options = {
  accessToken?: string,
  cliPath?: string[],
  apiUrl?: string,
  previewsUrl?: string,
  transport?: *
};

export default function Client({
  accessToken = process.env.ABSTRACT_TOKEN || "",
  cliPath,
  apiUrl,
  previewsUrl,
  transport: Transport = AUTO
}: Options = {}): AbstractInterface {
  if (!Transport) {
    throw new Error("options.transport is required");
  }

  return new Transport({ accessToken, cliPath, apiUrl, previewsUrl });
}
