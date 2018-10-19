// @flow
import type { AbstractInterface } from "../";
import AbstractCLI, { type Options as OptionsCLI } from "../AbstractCLI";
import AbstractAPI, { type Options as OptionsAPI } from "../AbstractAPI";

type Options = OptionsCLI & OptionsAPI;

// $FlowFixMe
class AbstractAUTO extends Proxy<*> implements AbstractInterface {
  constructor(options: Options) {
    const cli = new AbstractCLI(options);
    const api = new AbstractAPI(options);

    super(
      {},
      {
        get: function(obj, prop) {
          // $FlowFixMe
          return cli[prop] || api[prop];
        }
      }
    );
  }
}

export default AbstractAUTO;
