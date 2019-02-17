// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/notifications/notification", { id: "1337" });
    const response = await API_CLIENT.notifications.info({ notificationId: "notification" });
    expect(response).toEqual({ id: "1337" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/notifications?organizationId=org", {
      data: {
        activities: [{ id: "1337" }]
      }
    });
    const response = await API_CLIENT.notifications.list({ organizationId: "org" });
    expect(response).toEqual([{ id: "1337" }]);
  });
});
