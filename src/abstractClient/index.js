// @flow
import type { AbstractInterface, AbstractTransport } from "../";
import AbstractCLI from "./AbstractCLI";
// import AbstractAPI from "./AbstractAPI";

type Options = {
  abstractToken?: string,
  abstractCliPath?: string[],
  transport?: AbstractTransport
};

export const AUTO = AbstractCLI;
export const CLI = AbstractCLI;
// export const API = AbstractAPI;

export default function abstractClient({
  abstractToken = process.env.ABSTRACT_TOKEN || "",
  abstractCliPath,
  transport: Transport = AUTO
}: Options = {}): AbstractInterface {
  if (!abstractToken) {
    throw new Error("options.abstractToken or ABSTRACT_TOKEN required");
  }

  if (!Transport) {
    throw new Error("options.transport required");
  }

  return new Transport({ abstractToken, abstractCliPath });
}
