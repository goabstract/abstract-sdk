// @flow
import { mockAPI, API_CLIENT } from "@core/util/testing";

describe("projects", () => {
  describe("info", () => {
    test("api", async () => {
      mockAPI("/projects/project-id", {
        data: {
          id: "project-id"
        }
      });

      const response = await API_CLIENT.projects.info({
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "project-id"
      });
    });
  });

  describe("list", () => {
    test("api", async () => {
      mockAPI("/projects?organizationId=org-id", {
        data: {
          projects: [
            {
              id: "project-id"
            }
          ]
        }
      });

      const response = await API_CLIENT.projects.list({
        organizationId: "org-id"
      });

      expect(response).toEqual([
        {
          id: "project-id"
        }
      ]);
    });

    test("api - filtered by section", async () => {
      mockAPI(
        "/projects?filter=active&organizationId=org-id&sectionId=section-id",
        {
          data: {
            projects: [
              {
                id: "project-id",
                sectionId: "section-id"
              },
              {
                id: "project-id-2",
                sectionId: "section-id-2"
              }
            ]
          }
        }
      );

      const response = await API_CLIENT.projects.list(
        {
          organizationId: "org-id"
        },
        {
          filter: "active",
          sectionId: "section-id"
        }
      );

      expect(response).toEqual([
        {
          id: "project-id",
          sectionId: "section-id"
        }
      ]);
    });
  });
});
