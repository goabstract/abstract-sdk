// @flow
import { CLI_CLIENT } from "../src/util/testing";
import {
  EndpointUndefinedError,
  FileAPIError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError,
  throwAPIError,
  InternalServerError,
  throwCLIError
} from "../src/errors";

let globalBlob;

function getResponse(response) {
  return ({
    ...response,
    clone: () => ({ json: () => "json" })
  }: any);
}

describe("errors", () => {
  beforeAll(() => {
    globalBlob = global.Blob;
    global.Blob = undefined;
  });

  afterAll(() => {
    global.Blob = globalBlob;
  });

  describe("api", () => {
    test("UnauthorizedError", async () => {
      try {
        await throwAPIError(getResponse({ status: 401 }), "url", "body");
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
      }
    });

    test("ForbiddenError", async () => {
      try {
        await throwAPIError(getResponse({ status: 403 }), "url", "body");
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
      }
    });

    test("NotFoundError", async () => {
      try {
        await throwAPIError(getResponse({ status: 404 }), "url", "body");
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });

    test("RateLimitError", async () => {
      try {
        await throwAPIError(
          getResponse({ status: 429, headers: { get() {} } }),
          "url",
          "body"
        );
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
      }
    });

    test("InternalServerError", async () => {
      try {
        await throwAPIError(getResponse({ status: 500 }), "url", "body");
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerError);
      }
    });

    test("ServiceUnavailableError", async () => {
      try {
        await throwAPIError(getResponse({ status: 503 }), "url", "body");
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceUnavailableError);
      }
    });

    test("Default", async () => {
      try {
        await throwAPIError(getResponse({ status: 1337 }), "url", "body");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("cli", () => {
    test("FileAPIError", async () => {
      try {
        await CLI_CLIENT.previews.url({
          projectId: "project-id",
          branchId: "branch-id",
          fileId: "file-id",
          sha: "sha",
          layerId: "layer-id"
        });
      } catch (error) {
        expect(error).toBeInstanceOf(FileAPIError);
      }
    });

    test("EndpointUndefinedError", async () => {
      try {
        await CLI_CLIENT.projects.list({ organizationId: "org-id" });
      } catch (error) {
        expect(error.errors.cli).toBeInstanceOf(EndpointUndefinedError);
      }
    });

    test("UnauthorizedError", async () => {
      try {
        await throwCLIError(({ code: "unauthorized" }: any), "cliPath", {});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedError);
      }
    });

    test("ForbiddenError", async () => {
      try {
        await throwCLIError(({ code: "forbidden" }: any), "cliPath", {});
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
      }
    });

    test("NotFoundError", async () => {
      try {
        await throwCLIError(({ code: "not_found" }: any), "cliPath", {});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });

    test("RateLimitError", async () => {
      try {
        await throwCLIError(
          ({ code: "too_many_requests" }: any),
          "cliPath",
          {}
        );
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
      }
    });

    test("ServiceUnavailableError", async () => {
      try {
        await throwCLIError(
          ({ code: "service_unavailable" }: any),
          "cliPath",
          {}
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceUnavailableError);
      }
    });

    test("Default", async () => {
      try {
        await throwCLIError(({ code: "1337" }: any), "cliPath", {});
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
