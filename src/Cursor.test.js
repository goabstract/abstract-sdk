// @flow
import { mockAPI, API_CLIENT } from "./testing";
import { paginate } from ".";

test("supports async iteration", async () => {
  for (let i = 0; i < 3; i++) {
    mockAPI(`/activities?${i > 0 ? `offset=${i}&` : ""}organizationId=org-id`, {
      data: {
        activities: [{ id: `activity-id-${i}` }]
      },
      meta: {
        limit: 1,
        nextOffset: i === 2 ? undefined : i + 1,
        offset: i,
        total: 3
      }
    });
  }

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
