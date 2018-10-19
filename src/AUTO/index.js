// @flow
import type { AbstractInterface } from "../";
import AbstractCLI, { type Options as OptionsCLI } from "../AbstractCLI";
import AbstractAPI, { type Options as OptionsAPI } from "../AbstractAPI";

type Options = OptionsCLI & OptionsAPI;

// $FlowFixMe
class AbstractAUTO extends Proxy<*> implements AbstractInterface {
  constructor(props: Options) {
    const cli = new AbstractCLI(props);
    const api = new AbstractAPI(props);

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
