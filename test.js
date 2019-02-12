// @flow
const { Client } = require(".");

const abstract = new Client({
  cliPath:
    "/Users/bitpshr/Projects/abstract/projects/stable/abstract-cli/bin/abstract-cli"
});

const ABSTRACT_ORG_ID = "8a13eb62-a42f-435f-b3a3-39af939ad31b";

(async () => {
  //   Projects
  //   const projects = await abstract.projects.list({
  //     organizationId: ABSTRACT_ORG_ID
  //   });
  const branch = await abstract.branches.list(
    {
      projectId: "ab8d54b0-502f-11e6-9379-dd323631859b"
    },
    { filter: "active" }
  );
  console.log(branch);
  //   console.log(projects[0]);
  //   const project = await abstract.projects.info({
  //     projectId: projects[0].id
  //   });
  //   console.log(project);
})();
