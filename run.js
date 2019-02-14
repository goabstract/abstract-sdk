// @flow
const Client = require("./lib/Client");

const abstract = new Client.default({
  cliPath:
    "/Users/bitpshr/Projects/abstract/projects/stable/abstract-cli/bin/abstract-cli"
});

const ABSTRACT_ORG_ID = "8a13eb62-a42f-435f-b3a3-39af939ad31b";
const MACOS_PROJECT_ID = "ab8d54b0-502f-11e6-9379-dd323631859b";

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
})();
