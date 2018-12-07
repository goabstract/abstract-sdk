---
id: latest
title: Request latest commit
---

When using the SDK to query for various types of resources, it's common to pass in an `sha` property to limit results to a specific commit on a given project branch. In addition to specifying an actual SHA hash, the latest commit can always be targeted by passing the string `"latest"`.

For example, it's possible to fetch activities for the latest commit on the master branch of a project without knowing the actual commit hash:

```js
abstract.activities.list({
  branchId: "master",
  commitId: "latest",
  projectId: "b8bf5540-6e1e-11e6-8526-2d315b6ef48f"
});
```
