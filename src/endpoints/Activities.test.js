// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/activities/activity", { id: "1337" });
    const response = await API_CLIENT.activities.info({
      activityId: "activity"
    });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/activities?organizationId=org", {
      data: { activities: [{ id: "1337" }] }
    });
    const response = await API_CLIENT.activities.list({
      organizationId: "org"
    });
    expect(response).toEqual([{ id: "1337" }]);
  });
});
