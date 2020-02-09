// @flow
import sha256 from "js-sha256";
import { mockAPI, API_CLIENT } from "../../src/util/testing";

describe("stars", () => {
  describe("list", () => {
    test("api", async () => {
      mockAPI("/starred", [
        {
          id: "star-id"
        }
      ]);

      const response = await API_CLIENT.stars.list();

      expect(response).toEqual([
        {
          id: "star-id"
        }
      ]);
    });
  });

  describe("create - project", () => {
    test("api", async () => {
      mockAPI(
        "/starred/project-id",
        {
          id: "project-id"
        },
        201,
        "put"
      );

      const response = await API_CLIENT.stars.create({
        projectId: "project-id"
      });

      expect(response).toEqual({
        id: "project-id"
      });
    });
  });

  describe("create - section", () => {
    test("api", async () => {
      mockAPI(
        "/starred/section-id",
        {
          id: "section-id"
        },
        201,
        "put"
      );

      const response = await API_CLIENT.stars.create({
        sectionId: "section-id"
      });

      expect(response).toEqual({
        id: "section-id"
      });
    });
  });

  describe("delete - project", () => {
    test("api", async () => {
      mockAPI("/starred/project-id", {}, 200, "delete");

      const response = await API_CLIENT.stars.delete({
        projectId: "project-id"
      });

      expect(response).toEqual({});
    });
  });

  describe("delete - section", () => {
    test("api", async () => {
      mockAPI("/starred/section-id", {}, 200, "delete");

      const response = await API_CLIENT.stars.delete({
        sectionId: "section-id"
      });

      expect(response).toEqual({});
    });
  });
});
