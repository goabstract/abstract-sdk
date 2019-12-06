// @flow
import Activities from "@core/endpoints/Activities";
import Assets from "@core/endpoints/Assets";
import Branches from "@core/endpoints/Branches";
import Changesets from "@core/endpoints/Changesets";
import CollectionLayers from "@core/endpoints/Collection-layers";
import Collections from "@core/endpoints/Collections";
import Comments from "@core/endpoints/Comments";
import Commits from "@core/endpoints/Commits";
import Data from "@core/endpoints/Data";
import Descriptors from "@core/endpoints/Descriptors";
import Files from "@core/endpoints/Files";
import Layers from "@core/endpoints/Layers";
import Memberships from "@core/endpoints/Memberships";
import Notifications from "@core/endpoints/Notifications";
import Organizations from "@core/endpoints/Organizations";
import Pages from "@core/endpoints/Pages";
import Previews from "@core/endpoints/Previews";
import Projects from "@core/endpoints/Projects";
import Sections from "@core/endpoints/Sections";
import Shares from "@core/endpoints/Shares";
import Users from "@core/endpoints/Users";
import Webhooks from "@core/endpoints/Webhooks";
import type { CommandOptions } from "@core/types";

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
  sections: Sections;
  shares: Shares;
  users: Users;
  webhooks: Webhooks;

  constructor(options: $Shape<CommandOptions> = {}) {
    options = {
      accessToken: process.env.ABSTRACT_TOKEN,
      apiUrl: "https://api.goabstract.com",
      assetUrl: "https://objects.goabstract.com",
      previewUrl: "https://previews.goabstract.com",
      transportMode: ["api"],
      webUrl: "https://app.goabstract.com",
      // $FlowFixMe https://github.com/facebook/flow/pull/7298
      ...options
    };

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
    this.sections = new Sections(this, options);
    this.shares = new Shares(this, options);
    this.users = new Users(this, options);
    this.webhooks = new Webhooks(this, options);
  }
}
