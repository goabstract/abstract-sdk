// @flow
import Activities from "./endpoints/Activities";
import Assets from "./endpoints/Assets";
import Branches from "./endpoints/Branches";
import Changesets from "./endpoints/Changesets";
import Collections from "./endpoints/Collections";
import Comments from "./endpoints/Comments";
import Commits from "./endpoints/Commits";
import Data from "./endpoints/Data";
import Descriptors from "./endpoints/Descriptors";
import Endpoint from "./endpoints/Endpoint";
import Files from "./endpoints/Files";
import Layers from "./endpoints/Layers";
import Memberships from "./endpoints/Memberships";
import Notifications from "./endpoints/Notifications";
import Organizations from "./endpoints/Organizations";
import Pages from "./endpoints/Pages";
import Previews from "./endpoints/Previews";
import Projects from "./endpoints/Projects";
import Shares from "./endpoints/Shares";
import Users from "./endpoints/Users";
import type { CommandOptions } from "./types";

export default class Client {
  activities: Activities;
  assets: Assets;
  branches: Branches;
  changesets: Changesets;
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
  shares: Shares;
  users: Users;

  cache = new Map<string, any>();

  constructor(options: $Shape<CommandOptions> = {}) {
    options = {
      accessToken: process.env.ABSTRACT_TOKEN,
      apiUrl: "https://api.goabstract.com",
      cliPath:
        "/Applications/Abstract.app/Contents/Resources/app.asar.unpacked/node_modules/@elasticprojects/abstract-cli/bin/abstract-cli",
      maxCacheSize: 0,
      previewsUrl: "https://previews.goabstract.com",
      transportMode: "api",
      webUrl: "https://app.goabstract.com",
      // $FlowFixMe https://github.com/facebook/flow/pull/7298
      ...options
    };

    this.activities = new Activities(this, options);
    this.assets = new Assets(this, options);
    this.branches = new Branches(this, options);
    this.changesets = new Changesets(this, options);
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
    this.shares = new Shares(this, options);
    this.users = new Users(this, options);

    // This is only for informative errors; we proxy each method
    // on each endpoint so we can cache the last method name called.
    // This allows errors to explicitly state which method is undefined
    // in a given transport, and avoids using Function.caller which
    // mostly doesn't work and is nonstandard.
    return new Proxy(this, {
      get(target: Object, endpoint: string) {
        if (typeof target[endpoint] === "object" && target[endpoint]) {
          return new Proxy(target[endpoint], {
            get(target: Object, key: string) {
              if (
                typeof target[key] === "function" &&
                !Endpoint.prototype.hasOwnProperty(key)
              ) {
                target.lastCalledEndpoint = `${endpoint}.${key}`;
              }
              return target[key];
            }
          });
        }
        return target[endpoint];
      }
    });
  }
}
