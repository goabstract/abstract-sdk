// @flow
import { mockAPI, API_CLIENT } from "@core/util/testing";

describe("sections", () => {
  describe("list", () => {
    test("api", async () => {
      mockAPI("/sections?organizationId=org-id", [
        {
          id: "section-id"
        }
      ]);

      const response = await API_CLIENT.sections.list({
        organizationId: "org-id"
      });

      expect(response).toEqual([
        {
          id: "section-id"
        }
      ]);
    });
  });
});
