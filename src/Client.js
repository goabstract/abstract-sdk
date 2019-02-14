// @flow
import locatePath from "locate-path";
import Activities from "./endpoints/Activities";
import Branches from "./endpoints/Branches";
import Organizations from "./endpoints/Organizations";
import Projects from "./endpoints/Projects";
import type { CommandOptions } from "./types";

export default class Client {
  activities: Activities;
  branches: Branches;
  organizations: Organizations;
  projects: Projects;

  constructor(options: $Shape<CommandOptions> = {}) {
    const cliPathDefault =
      process.env.ABSTRACT_CLI_PATH ||
      locatePath.sync([
        // Relative to cwd
        "abstract-cli",
        // Relative to node_modules in cwd
        "node_modules/@elasticprojects/abstract-cli/bin/abstract-cli",
        // macOS App
        "/Applications/Abstract.app/Contents/Resources/app.asar.unpacked/node_modules/@elasticprojects/abstract-cli/bin/abstract-cli"
      ]);

    options = {
      accessToken: process.env.ABSTRACT_TOKEN,
      apiUrl: "https://api.goabstract.com",
      cliPath: cliPathDefault,
      previewsUrl: "https://previews.goabstract.com",
      transportMode: "auto",
      ...options
    };

    this.activities = new Activities(options);
    this.branches = new Branches(options);
    this.organizations = new Organizations(options);
    this.projects = new Projects(options);
  }
}
