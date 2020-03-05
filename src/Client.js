// @flow
import Activities from "./endpoints/Activities";
import Assets from "./endpoints/Assets";
import Branches from "./endpoints/Branches";
import Changesets from "./endpoints/Changesets";
import CollectionLayers from "./endpoints/CollectionLayers";
import Collections from "./endpoints/Collections";
import Comments from "./endpoints/Comments";
import Commits from "./endpoints/Commits";
import Data from "./endpoints/Data";
import Descriptors from "./endpoints/Descriptors";
import Files from "./endpoints/Files";
import Layers from "./endpoints/Layers";
import Memberships from "./endpoints/Memberships";
import Notifications from "./endpoints/Notifications";
import Organizations from "./endpoints/Organizations";
import Pages from "./endpoints/Pages";
import Previews from "./endpoints/Previews";
import Projects from "./endpoints/Projects";
import ReviewRequests from "./endpoints/ReviewRequests";
import Sections from "./endpoints/Sections";
import Shares from "./endpoints/Shares";
import Stars from "./endpoints/Stars";
import Users from "./endpoints/Users";
import Webhooks from "./endpoints/Webhooks";
import type { CommandOptions } from "./types";

/**
 * Client Class
 * @param {options} options
 * @param {string} [options.accessToken = undefined] - After generating an access token,
 * this option can be used to pass that token to the SDK.
 * This option accepts strings and both synchronous and asynchronous
 * functions that return strings.
 * Note that the SDK will automatically use an access token saved
 * as an ABSTRACT_TOKEN environment variable without any additional
 * configuration; this means that the accessToken option is only
 * required when ABSTRACT_TOKEN is not set.
 * See <a href="#authentication">Authentication</a> for more information.
 * @param {string} [options.apiUrl = https://api.goabstract.com] - This option can be used to specify a custom URL
 *  that points to an instance of the Abstract HTTP API.
 * This is used when building the request URLs used by the
 * <a href="transport">API transport</a>. This option is useful if HTTP requests
 * should be routed locally or through a proxy server.
 * @param {string} [options.objectUrl = https://objects.goabstract.com] - This option can be used to specify
 * a custom URL that points to an instance of the Abstract object retrieval service.
 * This is used when building URLs for static assets including files
 * and assets when using the <a href="transport">API transport</a>.
 * This option is useful if HTTP requests should be routed locally or through a proxy server.
 * @param {string} [options.previewUrl = https://previews.goabstract.com] -  This option can be used to specify a custom URL
 * that points to an instance of the Abstract preview service.
 * This is used when building preview image URLs used by the <a href='transport'>API transport</a>.
 * This option is useful if HTTP requests should be routed locally or through a proxy server.
 * @param {?("api"|"cli")} [options.transportMode = api] - The SDK can be configured
 * to use different data sources - known as "transports" - that each have unique advantages.
 * The transportMode option can be used to tell an SDK client to try to use a set of
 * transports in a specific order. This can also be overridden on a per-method basis. <br>
 * See <a href="transport">Transports</a> for more information.
 * @param {string} [options.webUrl = https://app.goabstract.com] - This option can be used to specify a custom URL
 * for the Abstract web application. This is used by the <a href="transport">API transport</a> when
 * generating URLs that link to specific parts of the web application.
 */
export default class Client {
  activities: Activities;
  assets: Assets;
  branches: Branches;
  changesets: Changesets;
  collectionLayers: CollectionLayers;
  collections: Collections;
  comments: Comments;
  commits: Commits;
  data: Data;
  descriptors: Descriptors;
  files: Files;
  layers: Layers;
  memberships: Memberships;
  notifications: Notifications;
  organizations: Organizations;
  pages: Pages;
  previews: Previews;
  projects: Projects;
  reviewRequests: ReviewRequests;
  sections: Sections;
  shares: Shares;
  stars: Stars;
  users: Users;
  webhooks: Webhooks;

  constructor(options: $Shape<CommandOptions> = {}) {
    options = {
      accessToken: process.env.ABSTRACT_TOKEN,
      apiUrl: "https://api.goabstract.com",
      objectUrl: "https://objects.goabstract.com",
      previewUrl: "https://previews.goabstract.com",
      transportMode: ["api"],
      webUrl: "https://app.goabstract.com",
      // $FlowFixMe https://github.com/facebook/flow/pull/7298
      ...options
    };

    /**
     * see [Activities](#activities)
     */
    this.activities = new Activities(this, options);

    /**
     * see [Assets](#assets)
     */
    this.assets = new Assets(this, options);

    /**
     * see [Branches](#branches)
     */
    this.branches = new Branches(this, options);

    /**
     * see [Changesets](#changesets)
     */
    this.changesets = new Changesets(this, options);

    /**
     * see [CollectionLayers](#collectionLayers)
     */
    this.collectionLayers = new CollectionLayers(this, options);

    /**
     * see [Collections](#collections)
     */
    this.collections = new Collections(this, options);

    /**
     * see [Comments](#comments)
     */
    this.comments = new Comments(this, options);

    /**
     * see [Commits](#commits)
     */
    this.commits = new Commits(this, options);

    /**
     * see [Data](#data)
     */
    this.data = new Data(this, options);

    /**
     * see [Descriptors](#descriptors)
     */
    this.descriptors = new Descriptors(this, options);

    /**
     * see [Files](#files)
     */
    this.files = new Files(this, options);

    /**
     * see [Layers](#layers)
     */
    this.layers = new Layers(this, options);

    /**
     * see [Memberships](#memberships)
     */
    this.memberships = new Memberships(this, options);

    /**
     * see [Notifications](#notifications)
     */
    this.notifications = new Notifications(this, options);

    /**
     * see [Organizations](#organizations)
     */
    this.organizations = new Organizations(this, options);

    /**
     * see [Pages](#pages)
     */
    this.pages = new Pages(this, options);

    /**
     * see [Previews](#previews)
     */
    this.previews = new Previews(this, options);

    /**
     * see [Projects](#projects)
     */
    this.projects = new Projects(this, options);

    /**
     * see [ReviewRequests](#reviewrequests)
     */
    this.reviewRequests = new ReviewRequests(this, options);

    /**
     * see [Sections](#sections)
     */
    this.sections = new Sections(this, options);

    /**
     * see [Shares](#shares)
     */
    this.shares = new Shares(this, options);

    /**
     * see [Stars](#stars)
     */
    this.stars = new Stars(this, options);

    /**
     * see [Users](#users)
     */
    this.users = new Users(this, options);

    /**
     * see [Webhooks](#webhooks)
     */
    this.webhooks = new Webhooks(this, options);
  }

  unwrap(value: any) {
    return value._response;
  }
}
