// @flow
import { mockAPI, API_CLIENT, CLIENT_CONFIG } from "../../src/util/testing";
import Client from "../../src/Client";

describe.only("activities", () => {
  describe("info", () => {
    test("api", async () => {
      mockAPI("/activities/activity-id", {
        id: "activity-id"
      });

      const response = await API_CLIENT.activities.info({
        activityId: "activity-id"
      });

      expect(response).toEqual({
        id: "activity-id"
      });
    });

    test("analytics", async () => {
      let analyticsResult;

      const client = new Client({
        ...CLIENT_CONFIG,
        analyticsCallback: analytics => (analyticsResult = analytics)
      });
      mockAPI("/activities/activity-id", {
        id: "activity-id"
      });

      await client.activities.info({
        activityId: "activity-id"
      });

      if (!analyticsResult) {
        throw new Error("analytics should be defined");
      }
      expect(analyticsResult.type).toEqual("Activities#info");
      expect(analyticsResult.transportMode).toEqual("api");
    });
  });

  describe("list", () => {
    test("api", async () => {
      mockAPI("/activities?organizationId=org-id", {
        data: {
          activities: [
            {
              id: "activity-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.activities.list({
        organizationId: "org-id"
      });

      expect(response).toEqual([
        {
          id: "activity-id"
        }
      ]);
    });
  });
});
