---
id: continuous-integration
title: Continuous integration
---

Many powerful SDK use cases rely on the ability to execute logic in response to an event inside the Abstract platform. This is especially useful when configuring a continuous integration flow where an action is taken any time new events occur within a given project. Possible Abstract integrations include:

- Slack integration
- Automatic icon generation
- Static preview generation

> We're hard at work implementing **web hooks**, a robust solution to that will allow efficient event subscription across the Abstract platform. The approach described below relies on polling and can be used until web hooks are released.

## Polling for activities

An activity in the Abstract platform represents a designated type of event within a project. These events can be specific to the project itself, or they can be specific to a collection, a branch, a commit, or a review within a project.

While web hooks are still in development, one way to mimic their behavior is to check for new Abstract activities on a set interval. The following code demonstrates this approach.

### 1. Fetch activities

Fetch the latest activities for a given project.

```js
const activities = await client.activities.list({ projectId: "..." });
```

### 2. Filter activities by type

Iterate through each activity and check its `type`. Note that while only `"COMMIT"` is used in this example, many other activity types are supported. Check out the [SDK type interfaces](https://github.com/goabstract/abstract-sdk/blob/master/src/types.js#L88-L292) for all activity types within the Abstract platform.

```js
activities.forEach(activity => {
  if (activity.type === "COMMIT") {
    // Commit occurred, do something with activity.payload
  }
});
```

### 3. Repeat on an interval

Now that activities are fetched and filtered, this logic should be repeated on a set interval. In this example, new activities are checked every 60 seconds, but any interval can be used as long as it does not exhaust the client [rate limit](/docs/rate-limits).

```js
async function poll() {
  const activities = await client.activities.list({ projectId: "..." });

  activities.forEach(activity => {
    if (activity.type === "COMMIT") {
      // Commit occurred, do something with activity.payload
    }
  });
}

setInterval(poll, 60000);
```

## Example: Slack integration

The following code is a complete, working example of a polling-based continuous integration script that checks for new commits in Abstract and posts them to Slack.

```js
import * as Abstract from "abstract-sdk";
import slack from "slack";

const client = new Abstract.Client();

let lastActivityId;

async function poll() {
    // Fetch activities for a given project
    const activities = await client.activities.list({ projectId: "..." });

    // Filter out activities that were processed during the last poll
    const newActivities = activities.slice(0, activities.findIndex(({ id }) => id === lastActivityId));

    // Iterate over each activity
    newActivities.forEach(activity => {
        // Only worry about commits
        if (activity.type === "COMMIT") {
            const { branchName, sha } = activity.payload;

            // Post a message to Slack for each commit
            slack.chat.postMessage({
                token: "...",
                channel: "...",
                text: `A new commit was pushed to the *${branchName}* branch: \`${sha}\`.`
            });
        }
    });

    // Cache the last activity that was processed
    lastActivityId = activities[0] && activities[0].id;
}

// Poll every 10 seconds
setInterval(poll, 10000);
```
