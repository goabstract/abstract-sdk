// @flow
import { mockAPI, API_CLIENT } from "../../src/util/testing";

describe("reviewRequests", () => {
  describe("list - organization", () => {
    test("api", async () => {
      mockAPI("/organizations/org-id/review_requests", {
        data: {
          reviewRequests: [{ id: "review-id" }]
        }
      });

      const response = await API_CLIENT.reviewRequests.list({
        organizationId: "org-id"
      });
      expect(response).toEqual([{ id: "review-id" }]);
    });
  });

  describe("list - project", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/review_requests", {
        data: {
          reviewRequests: [{ id: "review-id" }]
        }
      });

      const response = await API_CLIENT.reviewRequests.list({
        projectId: "project-id"
      });
      expect(response).toEqual([{ id: "review-id" }]);
    });
  });

  describe("list - branch", () => {
    test("api", async () => {
      mockAPI("/projects/project-id/branches/branch-id/review_requests", {
        data: {
          reviewRequests: [{ id: "review-id" }]
        }
      });

      const response = await API_CLIENT.reviewRequests.list({
        projectId: "project-id",
        branchId: "branch-id"
      });
      expect(response).toEqual([{ id: "review-id" }]);
    });
  });
});
