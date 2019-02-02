// @flow
import path from "path";
import Branches from "./endpoints/Branches";
import Projects from "./endpoints/Projects";
import type { CommandOptions } from "./types";

export default class Client {
  branches: Branches;
  projects: Projects;

  constructor(options: $Shape<CommandOptions> = {}) {
    const cliPathDefault = process.env.ABSTRACT_CLI_PATH
      ? process.env.ABSTRACT_CLI_PATH.split(path.delimiter || ":")
      : [
          // Relative to cwd
          "abstract-cli",
          // Relative to node_modules in cwd
          "node_modules/@elasticprojects/abstract-cli/bin/abstract-cli",
          // macOS App
          "/Applications/Abstract.app/Contents/Resources/app.asar.unpacked/node_modules/@elasticprojects/abstract-cli/bin/abstract-cli"
        ];

    options = {
      accessToken: process.env.ABSTRACT_TOKEN,
      apiUrl: "https://api.goabstract.com",
      cliPath: cliPathDefault,
      previewsUrl: "https://previews.goabstract.com",
      ...options
    };

    this.branches = new Branches(options);
    this.projects = new Projects(options);
  }
}
