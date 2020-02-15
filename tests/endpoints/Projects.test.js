// @flow
import { mockAPI, API_CLIENT } from "../../src/util/testing";
import type { Project } from "../../src/types";

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

  describe("create", () => {
    test("api", async () => {
      mockAPI(
        "/projects",
        {
          id: "project-id"
        },
        201,
        "post"
      );

      const response = await API_CLIENT.projects.create(
        {
          organizationId: "org-id"
        },
        {
          name: "project-name",
          organizationId: "org-id"
        }
      );

      expect(response).toEqual({
        id: "project-id"
      });
    });
  });

  describe("update", () => {
    test("api", async () => {
      mockAPI("/projects/project-id", { id: "project-id" }, 201, "put");

      const response = await API_CLIENT.projects.update(
        { projectId: "project-id" },
        (({
          name: "project-name",
          organizationId: "org-id"
        }: any): Project)
      );

      expect(response).toEqual({
        id: "project-id"
      });
    });
  });

  describe("delete", () => {
    test("api", async () => {
      mockAPI("/projects/project-id", {}, 200, "delete");

      const response = await API_CLIENT.projects.delete({
        projectId: "project-id"
      });

      expect(response).toEqual({});
    });
  });

  describe("archive", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/archive",
        {
          id: "project-id"
        },
        201,
        "put"
      );

      const response = await API_CLIENT.projects.archive({
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "project-id"
      });
    });
  });

  describe("unarchive", () => {
    test("api", async () => {
      mockAPI(
        "/projects/project-id/unarchive",
        {
          id: "project-id"
        },
        201,
        "put"
      );

      const response = await API_CLIENT.projects.unarchive({
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "project-id"
      });
    });
  });
});
