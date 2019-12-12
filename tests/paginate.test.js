// @flow
import { mockAPI, API_CLIENT } from "../src/util/testing";
import { paginate } from "../src/paginate";

describe("paginate", () => {
  beforeEach(() => {
    for (let i = 0; i < 3; i++) {
      mockAPI(
        `/activities?${i > 0 ? `offset=${i}&` : ""}organizationId=org-id`,
        {
          data: {
            activities: [{ id: `activity-id-${i}` }]
          },
          meta: {
            limit: 1,
            nextOffset: i === 2 ? undefined : i + 1,
            offset: i,
            total: 3
          }
        }
      );
    }
  });

  test("async iteration", async () => {
    const iterable = paginate(
      API_CLIENT.activities.list({
        organizationId: "org-id"
      })
    );

    let i = 0;
    for await (const page of iterable) {
      expect(page[0].id).toEqual(`activity-id-${i++}`);
    }
  });

  test("manual iteration", async () => {
    const pageOne = API_CLIENT.activities.list({
      organizationId: "org-id"
    });
    expect(await pageOne).toEqual([{ id: "activity-id-0" }]);

    const pageTwo = pageOne.next();
    expect(await pageTwo).toEqual([{ id: "activity-id-1" }]);

    const pageThree = pageTwo.next();
    expect(await pageThree).toEqual([{ id: "activity-id-2" }]);
  });
});
