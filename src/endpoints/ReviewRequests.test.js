// @flow
import { mockAPI, API_CLIENT } from "../testing";

describe("#list", () => {
  test("api", async () => {
    const organizationId = "bec23507-7540-40f1-93e2-afd558a4315e";
    const url = `/organizations/${organizationId}/review_requests`;
    mockAPI(url, {
      data: [
        {
          reviewRequests: [
            {
              id: "b3c9b1d6-8a1a-4985-b177-7d347eec76cf",
              branchId: "eefbddef-d39e-405b-8b4b-c57f07c50f8a",
              projectId: "ce49bb16-8e03-4853-8238-04d167ee9cc2",
              requesterId: "658da02e-5ffb-42df-9d39-afc84f1ad8c3",
              reviewerId: "0cb558d5-dd9f-406d-8b84-88983b747016",
              reviewer: {
                id: "0cb558d5-dd9f-406d-8b84-88983b747016",
                primaryEmailId: "f9cd61c2-9b6f-4558-ac91-e3e4948bf611",
                createdAt: "2019-05-16T21:17:59.664Z",
                updatedAt: "2019-06-06T15:07:16.905Z",
                username: "anolson",
                name: "Andrew Olson",
                avatarUrl:
                  "https://www.gravatar.com/avatar/b4e56d2c1c58e431ec28ab416c666c49?r=pg&s=160&d=404",
                isScimProvisioned: false
              },
              requester: {
                id: "658da02e-5ffb-42df-9d39-afc84f1ad8c3",
                primaryEmailId: "cfaad620-c0de-4f49-af0b-ffa95ef7f6f5",
                createdAt: "2019-06-10T14:30:58.570Z",
                updatedAt: "2019-07-08T17:37:56.139Z",
                username: "john",
                name: "John Nelson",
                avatarUrl:
                  "https://www.gravatar.com/avatar/c467c8e7e1dc3135e4f2788a65112971?r=pg&s=160&d=404",
                isScimProvisioned: false
              },
              commentId: null,
              status: "REQUESTED",
              createdAt: "2019-10-22T22:52:12.796Z",
              deletedAt: null,
              statusChangedAt: "2019-10-22T22:52:13.796Z"
            }
          ],
          branchReviews: [],
          branches: []
        }
      ]
    });
    const response = await API_CLIENT.reviewRequests.list({
      id: organizationId
    });
    expect(response).toEqual([
      {
        reviewRequests: [
          {
            id: "b3c9b1d6-8a1a-4985-b177-7d347eec76cf",
            branchId: "eefbddef-d39e-405b-8b4b-c57f07c50f8a",
            projectId: "ce49bb16-8e03-4853-8238-04d167ee9cc2",
            requesterId: "658da02e-5ffb-42df-9d39-afc84f1ad8c3",
            reviewerId: "0cb558d5-dd9f-406d-8b84-88983b747016",
            reviewer: {
              id: "0cb558d5-dd9f-406d-8b84-88983b747016",
              primaryEmailId: "f9cd61c2-9b6f-4558-ac91-e3e4948bf611",
              createdAt: "2019-05-16T21:17:59.664Z",
              updatedAt: "2019-06-06T15:07:16.905Z",
              username: "anolson",
              name: "Andrew Olson",
              avatarUrl:
                "https://www.gravatar.com/avatar/b4e56d2c1c58e431ec28ab416c666c49?r=pg&s=160&d=404",
              isScimProvisioned: false
            },
            requester: {
              id: "658da02e-5ffb-42df-9d39-afc84f1ad8c3",
              primaryEmailId: "cfaad620-c0de-4f49-af0b-ffa95ef7f6f5",
              createdAt: "2019-06-10T14:30:58.570Z",
              updatedAt: "2019-07-08T17:37:56.139Z",
              username: "john",
              name: "John Nelson",
              avatarUrl:
                "https://www.gravatar.com/avatar/c467c8e7e1dc3135e4f2788a65112971?r=pg&s=160&d=404",
              isScimProvisioned: false
            },
            commentId: null,
            status: "REQUESTED",
            createdAt: "2019-10-22T22:52:12.796Z",
            deletedAt: null,
            statusChangedAt: "2019-10-22T22:52:13.796Z"
          }
        ],
        branchReviews: [],
        branches: []
      }
    ]);
  });
});
