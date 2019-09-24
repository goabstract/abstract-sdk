---
id: webhooks
title: Webhooks
---

Webhooks make it easy to efficiently subscribe to events across the Abstract platform. Whenever one of these events is triggered by some action in either the web or desktop Abstract application, an HTTP `POST` request will be sent to a user-configured URL.

Many powerful SDK use cases rely on this ability to execute logic in response to a specific Abstract event. This is especially useful when configuring a continuous integration flow where an action is taken any time new events occur within a given project or branch. Possible Abstract integrations include:

- Slack integration
- Automatic icon generation
- Static preview generation

> **Webhooks are currently in beta.** Please note that payloads, event names, and other related functionality could change before launching publicly.
>
> [**Request beta access now**](https://docs.google.com/forms/d/e/1FAIpQLSevRBz_upT8p2YrieDRrlIKyAUAOHQ5A1xZFn2AMLlrae2rOA/viewform)

## Creating a webhook

Webhooks are specific to an organization and can be created via its integration settings. The following process outlines how to create a new webhook.

1. Go to the **Integrations** settings page.
2. Click the  **Add Webhook** button.
3. Configure a receiving HTTPS endpoint URL.
4. Configure events that should trigger deliveries.
5. Click the **Add Webhook** button.

![Create a webhook](/img/create-webhook-animated.gif)

## Managing a webhook

Existing webhooks can be managed via an organization's integration settings. Webhooks can be tested, updated, and deleted, and their successful and unsuccessful delivery attempts can be viewed and inspected.

1. Go to the **Integrations** settings page.
2. Select an existing webhook.
3. Test, update, or delete the webhook.

![Manage a webhook](/img/manage-webhook-animated.gif)

## Supported events

When setting up a new webhook, it's necessary to select the events that should trigger deliveries. It's recommended to only select the specific events that your application needs. This both limits the number of requests that your server receives and also simplifies the logic necessary to filter multiple event types.

| Name | Description |
|-|-|
| `project.created` | Triggered when a new project is created. |
| `project.updated` | Triggered when an existing project is updated. |
| `project.deleted` | Triggered when a project is deleted. |
| `branch.created` | Triggered when a new branch is created. |
| `branch.updated` | Triggered when an existing branch is updated. |
| `branch.statusUpdated` | Triggered when a branch's status is updated. |
| `commits.created` | Triggered when new commits are pushed to a branch. |
| `comment.created` | Triggered when a new comment is posted. |
| `comment.updated` | Triggered when an existing comment is updated. |
| `comment.deleted` | Triggered when a comment is deleted. |

## Delivery payloads

When any of a webhook's events are triggered by some action in the Abstract application, an HTTP `POST` request will be sent to the webhook's configured URL. These requests will include both Abstract-specific headers and JSON data payloads that are specific to each event type.

### Abstract-specific headers

Webhook delivery requests will include the Abstract-specific headers detailed below.

| Header | Description |
|-|-|
| `User-Agent` | The user agent for webhook delivery requests will be `Abstract-Webhooks`. |

### Example payload

```sh
POST /example-webhook HTTP/1.1
Accept-Encoding: gzip
Connection: close
Content-Length: 812
Content-Type: application/json
Host: localhost:1337
User-Agent: Abstract-Webhooks
{
  "createdAt": "2019-09-06T19:23:56Z",
  "event": "project.updated",
  "data": {
    "object": {
      "about": null,
      "archivedAt": null,
      "color": "#000",
      "createdAt": "2019-07-12T14:40:32Z",
      "createdByUser": {
        "avatarUrl": "https://avatars.goabstract.com/avatars/4010bed7-9ada-4eb4-9d9a-09c8b095d0a2.",
        "createdAt": "2018-11-04T18:28:19Z",
        "email": "paul@abstract.com",
        "id": "e5954a04-26ea-4600-a41b-1f74350be974",
        "name": "Paul",
        "objectType": "user",
        "updatedAt": "2019-06-17T16:12:47Z",
        "username": "bitpshr"
      },
      "deletedAt": null,
      "description": null,
      "firstPushedAt": "2019-07-12T14:40:36Z",
      "id": "003a1ae0-a4b3-11e9-807c-a35b74e69da5",
      "name": "SDK Examples (edited)",
      "objectType": "project",
      "organizationId": "4ed01dff-4bc7-47cd-8b51-9ea3ec9e5de4",
      "pushedAt": "2019-08-26T14:10:46Z",
      "sectionId": null,
      "updatedAt": "2019-09-06T19:23:56Z",
      "visibility": "organization"
    }
  }
}
```
