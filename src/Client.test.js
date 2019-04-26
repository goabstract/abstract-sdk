// @flow
import { mockAPI, API_CLIENT, API_CLIENT_CACHED } from "./testing";

describe("cache", () => {
  beforeAll(() => {
    const fetch = global.fetch;
    global.fetch = jest.fn().mockImplementation((...args) => fetch(...args));
  });

  beforeEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    global.fetch.mockRestore();
  });

  test("uses cache on subsequent entity requests", async () => {
    mockAPI("/activities/foo", { id: "foo" });
    mockAPI("/activities/bar", { id: "bar" });
    mockAPI("/activities/baz", { id: "baz" });

    const response1 = await API_CLIENT_CACHED.activities.info({
      activityId: "foo"
    });
    const response2 = await API_CLIENT_CACHED.activities.info({
      activityId: "foo"
    });
    const response3 = await API_CLIENT_CACHED.activities.info({
      activityId: "bar"
    });
    const response4 = await API_CLIENT_CACHED.activities.info({
      activityId: "bar"
    });
    const response5 = await API_CLIENT_CACHED.activities.info({
      activityId: "baz"
    });
    const response6 = await API_CLIENT_CACHED.activities.info({
      activityId: "baz"
    });

    expect(response1).toEqual({ id: "foo" });
    expect(response2).toEqual({ id: "foo" });
    expect(response3).toEqual({ id: "bar" });
    expect(response4).toEqual({ id: "bar" });
    expect(response5).toEqual({ id: "baz" });
    expect(response6).toEqual({ id: "baz" });
    expect(global.fetch).toBeCalledTimes(3);
  });

  test("does not cache { sha: 'latest' } entity requests", async () => {
    const files = [{ id: "file-id" }];
    const descriptor = {
      branchId: "branch-id",
      fileId: "file-id",
      projectId: "project-id",
      sha: "latest"
    };

    for (let i = 0; i < 2; i++) {
      mockAPI(
        "/projects/project-id/branches/branch-id/commits?fileId=file-id&limit=1",
        {
          commits: [{ id: "commit-id" }]
        }
      );
      mockAPI("/projects/project-id/branches/branch-id/files", { files });
    }

    const response1 = await API_CLIENT_CACHED.files.info(descriptor);
    const response2 = await API_CLIENT_CACHED.files.info(descriptor);

    expect(response1).toEqual({ id: "file-id" });
    expect(response2).toEqual({ id: "file-id" });
    expect(global.fetch).toBeCalledTimes(4);
  });

  test("does not cache uncached entity requests", async () => {
    mockAPI("/projects?organizationId=foo", {
      data: [{ id: "foo" }]
    });
    mockAPI("/projects?organizationId=foo", {
      data: [{ id: "foo" }]
    });

    const response1 = await API_CLIENT_CACHED.projects.list({
      organizationId: "foo"
    });
    const response2 = await API_CLIENT_CACHED.projects.list({
      organizationId: "foo"
    });

    expect(response1).toEqual([{ id: "foo" }]);
    expect(response2).toEqual([{ id: "foo" }]);
    expect(global.fetch).toBeCalledTimes(2);
  });

  test("respects maxCacheSize", async () => {
    mockAPI("/activities/foo", { id: "foo" });
    mockAPI("/activities/foo", { id: "foo" });
    mockAPI("/activities/bar", { id: "bar" });
    mockAPI("/activities/bar", { id: "bar" });
    mockAPI("/activities/baz", { id: "baz" });
    mockAPI("/activities/baz", { id: "baz" });

    const response1 = await API_CLIENT.activities.info({ activityId: "foo" });
    const response2 = await API_CLIENT.activities.info({ activityId: "foo" });
    const response3 = await API_CLIENT.activities.info({ activityId: "bar" });
    const response4 = await API_CLIENT.activities.info({ activityId: "bar" });
    const response5 = await API_CLIENT.activities.info({ activityId: "baz" });
    const response6 = await API_CLIENT.activities.info({ activityId: "baz" });

    expect(response1).toEqual({ id: "foo" });
    expect(response2).toEqual({ id: "foo" });
    expect(response3).toEqual({ id: "bar" });
    expect(response4).toEqual({ id: "bar" });
    expect(response5).toEqual({ id: "baz" });
    expect(response6).toEqual({ id: "baz" });
    expect(global.fetch).toBeCalledTimes(6);
  });
});
