// @flow
import { CLIENT_CONFIG } from "../../src/util/testing";
import Client from "../../src/Client";
import Endpoint from "../../src/endpoints/Endpoint";
import type { EndpointMetric } from "../../src/types";

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

class ExampleEndpoint extends Endpoint {
  name = "exampleEndpoint";

  info() {
    return this.configureRequest<Promise<void>>("info", {
      api() {
        return sleep(1);
      },
      cli() {
        return sleep(1);
      }
    });
  }
}

describe("endpoint", () => {
  describe("analyticsCallback", () => {
    test("api", async () => {
      let analyticsResult: ?EndpointMetric;
      const options = {
        ...CLIENT_CONFIG,
        analyticsCallback: analytics => (analyticsResult = analytics)
      };

      const client = new Client(options);
      const endpoint = new ExampleEndpoint(client, {
        ...options,
        transportMode: ["api"],
        webUrl: "https://example.com"
      });

      await endpoint.info();

      if (!analyticsResult) {
        throw new Error("analytics should be defined");
      }
      expect(analyticsResult.duration).toBeGreaterThan(0);
      expect(analyticsResult.endpoint).toEqual("exampleEndpoint");
      expect(analyticsResult.request).toEqual("info");
      expect(analyticsResult.transportMode).toEqual("api");
    });

    test("cli", async () => {
      let analyticsResult: ?EndpointMetric;
      const options = {
        ...CLIENT_CONFIG,
        analyticsCallback: analytics => (analyticsResult = analytics)
      };

      const client = new Client(options);
      const endpoint = new ExampleEndpoint(client, {
        ...options,
        transportMode: ["cli"],
        webUrl: "https://example.com"
      });

      await endpoint.info();

      if (!analyticsResult) {
        throw new Error("analytics should be defined");
      }
      expect(analyticsResult.duration).toBeGreaterThan(0);
      expect(analyticsResult.endpoint).toEqual("exampleEndpoint");
      expect(analyticsResult.request).toEqual("info");
      expect(analyticsResult.transportMode).toEqual("cli");
    });
  });
});
