// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#list", () => {
  test("api", async () => {
    mockAPI("/starred", {
      data: [
        {
          starrableId: "bb03a32d-74e2-49b9-9810-f354a09bbf28",
          starrableType: "Project",
          starredAt: "2019-10-22T20:46:07.519Z"
        }
      ]
    });
    const response = await API_CLIENT.starred.list();
    expect(response).toEqual([
      {
        starrableId: "bb03a32d-74e2-49b9-9810-f354a09bbf28",
        starrableType: "Project",
        starredAt: "2019-10-22T20:46:07.519Z"
      }
    ]);
  });
});
