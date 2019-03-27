// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/activities/activity-id", { id: "activity-id" });
    const response = await API_CLIENT.activities.info({
      activityId: "activity-id"
    });
    expect(response).toEqual({ id: "activity-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/activities?organizationId=org-id", {
      data: { activities: [{ id: "activity-id" }] }
    });
    const response = await API_CLIENT.activities.list({
      organizationId: "org-id"
    });
    expect(response).toEqual([{ id: "activity-id" }]);
  });
});
