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
import { generateAuthorizeUrl } from "./util/helpers";
import type { CommandOptions, AnalyticsCallback } from "./types";

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
  generateAuthorizeUrl: typeof generateAuthorizeUrl;

  _analyticsCallback: ?AnalyticsCallback;

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

    this._analyticsCallback = options.analyticsCallback;
    this.activities = new Activities(this, options);
    this.assets = new Assets(this, options);
    this.branches = new Branches(this, options);
    this.changesets = new Changesets(this, options);
    this.collectionLayers = new CollectionLayers(this, options);
    this.collections = new Collections(this, options);
    this.comments = new Comments(this, options);
    this.commits = new Commits(this, options);
    this.data = new Data(this, options);
    this.descriptors = new Descriptors(this, options);
    this.files = new Files(this, options);
    this.layers = new Layers(this, options);
    this.memberships = new Memberships(this, options);
    this.notifications = new Notifications(this, options);
    this.organizations = new Organizations(this, options);
    this.pages = new Pages(this, options);
    this.previews = new Previews(this, options);
    this.projects = new Projects(this, options);
    this.reviewRequests = new ReviewRequests(this, options);
    this.sections = new Sections(this, options);
    this.shares = new Shares(this, options);
    this.stars = new Stars(this, options);
    this.users = new Users(this, options);
    this.webhooks = new Webhooks(this, options);
    this.generateAuthorizeUrl = generateAuthorizeUrl.bind({ options });
  }

  unwrap(value: any) {
    return value._response;
  }
}
