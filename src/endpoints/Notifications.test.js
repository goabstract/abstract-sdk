// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#info", () => {
  test("api", async () => {
    mockAPI("/notifications/notification-id", { id: "notification-id" });
    const response = await API_CLIENT.notifications.info({
      notificationId: "notification-id"
    });
    expect(response).toEqual({ id: "notification-id" });
  });
});

describe("#list", () => {
  test("api", async () => {
    mockAPI("/notifications?organizationId=org-id", {
      data: [{ id: "notification-id" }]
    });
    const response = await API_CLIENT.notifications.list({
      organizationId: "org-id"
    });
    expect(response).toEqual([{ id: "notification-id" }]);
  });
});
