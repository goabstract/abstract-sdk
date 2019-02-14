// @flow
const Client = require("./lib/Client");

const abstract = new Client.default({
  cliPath:
    "/Users/bitpshr/Projects/abstract/projects/stable/abstract-cli/bin/abstract-cli"
});

const ABSTRACT_ORG_ID = "8a13eb62-a42f-435f-b3a3-39af939ad31b";
const MACOS_PROJECT_ID = "ab8d54b0-502f-11e6-9379-dd323631859b";
const COMMIT_SHA = "a5987485107345dc5db2b35bdd2b6cd9b9991607";

(async () => {
  // Organizations
  const organizations = await abstract.organizations.list();
  console.log(
    `\n\n\n🔥  organizations#list\nTotal:\t${organizations.length}\nFirst:\t${
      organizations[0].id
    }`
  );

  const organization = await abstract.organizations.info({
    organizationId: ABSTRACT_ORG_ID
  });
  console.log(`\n\n\n🔥  organizations#info\nItem:\t${organization.id}`);

  // Projects
  const projects = await abstract.projects.list({
    organizationId: ABSTRACT_ORG_ID
  });
  console.log(
    `\n\n\n🔥  projects#list\nTotal:\t${projects.length}\nFirst:\t${
      projects[0].id
    }`
  );

  const project = await abstract.projects.info({
    projectId: MACOS_PROJECT_ID
  });
  console.log(`\n\n\n🔥  projects#info\nItem:\t${project.id}`);

  // Branches
  const branches = await abstract.branches.list({
    projectId: MACOS_PROJECT_ID
  });
  console.log(
    `\n\n\n🔥  branches#list\nTotal:\t${branches.length}\nFirst:\t${
      branches[0].id
    }`
  );

  const branch = await abstract.branches.info({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: "foo"
  });
  console.log(`\n\n\n🔥  branches#info\nItem:\t${branch.id}`);

  // Activities
  const activities = await abstract.activities.list({
    organizationId: ABSTRACT_ORG_ID
  });
  console.log(
    `\n\n\n🔥  activities#list\nTotal:\t${activities.length}\nFirst:\t${
      activities[0].id
    }`
  );

  const activity = await abstract.activities.info({
    activityId: activities[0].id
  });
  console.log(`\n\n\n🔥  activities#info\nItem:\t${activity.id}`);

  // Commits
  const commits = await abstract.commits.list({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: COMMIT_SHA
  });
  console.log(
    `\n\n\n🔥  commits#list\nTotal:\t${commits.length}\nFirst:\t${
      commits[0].sha
    }`
  );

  const commit = await abstract.commits.info({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: commits[0].sha
  });
  console.log(`\n\n\n🔥  commits#info\nItem:\t${commit.sha}`);
})();
