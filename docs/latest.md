---
id: latest
title: Request latest commit
---

When using the SDK to query for various types of resources, it's common to pass in an `sha` property to limit results to a specific commit on a given project branch. In addition to specifying an actual SHA hash, the latest commit can always be targeted by passing the string `"latest"`.

For example, it's possible to fetch all files for the latest commit on the master branch of a project without knowing the actual commit hash:

```js
abstract.files.list({
  branchId: "master",
  projectId: "b22d7d80-d198-11e8-9718-e3d50f1a1b38",
  sha: "latest"
});
```
