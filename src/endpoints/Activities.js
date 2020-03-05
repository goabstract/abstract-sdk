// @flow
import querystring from "query-string";
import type {
  Activity,
  ActivityDescriptor,
  BranchDescriptor,
  CursorPromise,
  ListOptions,
  OrganizationDescriptor,
  ProjectDescriptor,
  RequestOptions
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 * @class Activities
 * @extends Endpoint
 * @description
 * An activity represents a designated type of event within a project.
 * These events can be specific to the project itself,
 * or they can be specific to a collection, a branch, a commit,
 * or a review within the project.
 */
export default class Activities extends Endpoint {
  /**
   * @param {ActivityDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @memberof Activities
   * @returns {Promise<Activity>}
   * @example // Load the info for an activity
   * const client = new Abstract.Client({});
   * const getListOfProjects = async () => await new Abstract.Client({}).activities.list();
   * getListOfProjects().then(result => console.log(result));
   * @example
   * // Import the SDK client
   * import * as Abstract from "abstract-sdk";
   *
   * // Create a client
   * const client = new Abstract.Client({
   * // Use the cli if available, otherwise use the api
   *   transportMode: ["cli", "api"]
   * });
   *
   * async function run() {
   *   // Query all projects
   *   const projects = await client.projects.list();
   *   // Iterate through each project
   *   for (const project of projects) {
   *   // Log the number of branches
   *     const branches = await client.branches.list({ projectId: project.id });
   *     console.log(`${project.name}: ${branches.length} branches`);
   *   }
   * }
   * run();
   */
  info(descriptor: ActivityDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Activity>>({
      api: async () => {
        const response = await this.apiRequest(
          `activities/${descriptor.activityId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   * @param {(BranchDescriptor | OrganizationDescriptor | ProjectDescriptor)} descriptor
   * @param {ListOptions} [options={}]
   * @memberof Activities
   * @returns {CursorPromise<Activity[]>}
   * @example // List All Activities
   *  new Abstract.Client({}).activities.list({
   *    branchId: "8a13eb62-a42f-435f-b3a3-39af939ad31b",
   *    projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f",
   *  }, { limit: 2 });
   */
  list(
    descriptor: BranchDescriptor | OrganizationDescriptor | ProjectDescriptor,
    options: ListOptions = {}
  ) {
    const { limit, offset, ...requestOptions } = options;

    return this.createCursor<CursorPromise<Activity[]>>(
      (nextOffset = offset) => ({
        api: () => {
          const query = querystring.stringify({
            ...descriptor,
            limit,
            offset: nextOffset
          });

          return this.apiRequest(`activities?${query}`);
        },
        requestOptions
      }),
      response => wrap(response.data.activities, response)
    );
  }
}
