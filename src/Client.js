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
import OAuth from "./endpoints/OAuth";
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
import type { CommandOptions, AnalyticsCallback } from "./types";

export default class Client {
  options: CommandOptions;
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
  oauth: OAuth;
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

  _analyticsCallback: ?AnalyticsCallback;

  constructor(options: $Shape<CommandOptions> = {}) {
    this.options = {
      accessToken: process.env.ABSTRACT_TOKEN,
      apiUrl: "https://api.goabstract.com",
      objectUrl: "https://objects.goabstract.com",
      previewUrl: "https://previews.goabstract.com",
      transportMode: ["api"],
      webUrl: "https://app.goabstract.com",
      // $FlowFixMe https://github.com/facebook/flow/pull/7298
      ...options
    };

    this._analyticsCallback = this.options.analyticsCallback;
    this.activities = new Activities(this);
    this.assets = new Assets(this);
    this.branches = new Branches(this);
    this.changesets = new Changesets(this);
    this.collectionLayers = new CollectionLayers(this);
    this.collections = new Collections(this);
    this.comments = new Comments(this);
    this.commits = new Commits(this);
    this.data = new Data(this);
    this.descriptors = new Descriptors(this);
    this.files = new Files(this);
    this.layers = new Layers(this);
    this.memberships = new Memberships(this);
    this.notifications = new Notifications(this);
    this.oauth = new OAuth(this);
    this.organizations = new Organizations(this);
    this.pages = new Pages(this);
    this.previews = new Previews(this);
    this.projects = new Projects(this);
    this.reviewRequests = new ReviewRequests(this);
    this.sections = new Sections(this);
    this.shares = new Shares(this);
    this.stars = new Stars(this);
    this.users = new Users(this);
    this.webhooks = new Webhooks(this);
  }

  setToken(accessToken: string) {
    this.options.accessToken = accessToken;
  }

  unwrap(value: any) {
    return value._response;
  }
}
