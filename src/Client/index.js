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
  apiUrl = "https://api.goabstract.com",
  previewsUrl = "https://api.goabstract.com",
  transport: Transport = AUTO
}: Options = {}): AbstractInterface {
  if (!accessToken) {
    throw new Error(
      "options.accessToken or ABSTRACT_TOKEN set as an environment variable is required"
    );
  }

  if (!Transport) {
    throw new Error("options.transport is required");
  }

  return new Transport({ accessToken, cliPath, apiUrl, previewsUrl });
}
