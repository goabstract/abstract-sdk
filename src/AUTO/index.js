// @flow
import type { AbstractInterface } from "../types";
import AbstractCLI, { type Options as OptionsCLI } from "../AbstractCLI";
import AbstractAPI, { type Options as OptionsAPI } from "../AbstractAPI";

type Options = OptionsCLI & OptionsAPI;

// $FlowFixMe
class AbstractAUTO implements AbstractInterface {
  constructor(options: Options) {
    // AbstractCLI is not available in browsers (see: package.json#browsers)
    const cli =
      typeof AbstractCLI === "function" ? new AbstractCLI(options) : {};

    const api = new AbstractAPI(options);

    return new Proxy(this, {
      get: function(obj, prop) {
        // $FlowFixMe
        return cli[prop] || api[prop];
      }
    });
  }
}

export default AbstractAUTO;
