// @flow
const Abstract = require(".");

const abstract = new Abstract.Client({
  transportMode: "api",
  cliPath:
    "/Users/bitpshr/Projects/abstract/projects/stable/abstract-cli/bin/abstract-cli"
});

const ABSTRACT_ORG_ID = "8a13eb62-a42f-435f-b3a3-39af939ad31b";
const MACOS_PROJECT_ID = "ab8d54b0-502f-11e6-9379-dd323631859b";
const COMMIT_SHA = "cbf3bf3b6bc5f5a3f459496a606ba3fd95cf0d85";
const FILE_ID = "CD894480-2E6B-48C5-89D2-9132D6F147E0";

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

  // Files
  const files = await abstract.files.list({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: COMMIT_SHA
  });
  console.log(
    `\n\n\n🔥  files#list\nTotal:\t${files.length}\nFirst:\t${files[0].id}`
  );

  const file = await abstract.files.info({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: COMMIT_SHA,
    fileId: files[0].id
  });
  console.log(`\n\n\n🔥  files#info\nItem:\t${file.id}`);

  // Pages
  const pages = await abstract.pages.list({
    branchId: "master",
    fileId: "7E952DD7-C4E7-4DCC-8897-60947B82CAF1",
    projectId: MACOS_PROJECT_ID,
    sha: "6ab211cfdd5a19adc7bce4597b4267e89a928594"
  });
  console.log(
    `\n\n\n🔥  pages#list\nTotal:\t${pages.length}\nFirst:\t${pages[0].id}`
  );

  const page = await abstract.pages.info({
    branchId: "master",
    fileId: "7E952DD7-C4E7-4DCC-8897-60947B82CAF1",
    pageId: pages[0].id,
    projectId: MACOS_PROJECT_ID,
    sha: "6ab211cfdd5a19adc7bce4597b4267e89a928594"
  });
  console.log(`\n\n\n🔥  pages#info\nItem:\t${page.id}`);

  // Layers
  const layers = await abstract.layers.list({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: COMMIT_SHA,
    fileId: FILE_ID
  });
  console.log(
    `\n\n\n🔥  layers#list\nTotal:\t${layers.length}\nFirst:\t${layers[0].id}`
  );

  const layer = await abstract.layers.info({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: COMMIT_SHA,
    fileId: FILE_ID,
    layerId: layers[0].id,
    pageId: layers[0].pageId
  });
  console.log(`\n\n\n🔥  layers#info\nItem:\t${layer.id}`);

  // Comments
  const comments = await abstract.comments.list({
    projectId: MACOS_PROJECT_ID,
    branchId: "master",
    sha: COMMIT_SHA
  });
  console.log(
    `\n\n\n🔥  comments#list\nTotal:\t${comments.length}\nFirst:\t${
      comments[0].id
    }`
  );

  const comment = await abstract.comments.info({
    commentId: comments[0].id
  });
  console.log(`\n\n\n🔥  comments#info\nItem:\t${comment.id}`);

  const newComment = await abstract.comments.create(
    {
      projectId: MACOS_PROJECT_ID,
      branchId: "master",
      sha: COMMIT_SHA
    },
    {
      body: "Hello, world!"
    }
  );
  console.log(`\n\n\n🔥  comments#create\nItem:\t${newComment.id}`);
})();
