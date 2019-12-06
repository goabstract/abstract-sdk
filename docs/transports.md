---
id: transports
title: Transports
---

The SDK can be configured to use different data sources - known as "transports" - that each have unique advantages.

> Some SDK methods are only available when using a specific transport. Check the [API reference](/docs/abstract-api) for more information.

## API

The Abstract API is a transport mode that uses HTTP to interact with Abstract's own hosted servers. This transport is especially useful in remote execution environments since it does not require the Abstract desktop application or data on the local disk. This transport requires [authentication](/docs/authentication) and requests are subject to [rate limits](/docs/rate-limits).

## CLI

The Abstract CLI is a transport mode that uses the Abstract desktop application to interact with data stored locally on a given machine. This transport does not require internet connectivity or authentication, and requests are not subject to rate limits. This transport does require access to the Abstract desktop application and its underlying data, as such it can only be used on macOS currently.

## Using a specific transport

The SDK currently uses the API transport by default, but this could change in the future. For the most resilient configuration, it's recommended to explicitly set the transport mode that works best for your SDK use case.

The `transportMode` configuration option can be used to tell an SDK client to try to use a set of transports in a specific order.

```js
const client = new Abstract.Client({
  transportMode: ["api", "cli"]
});
```

All SDK methods accept an options object as their last argument. This object can be used to specify a one-time `transportMode` that overrides the global `transportMode` for a given SDK operation.

```js
// Globally configure both an API and a CLI transport
const client = new Abstract.Client({
  transportMode: ["api", "cli"]
});

// Only use a CLI transport for this operation
client.branches.list({
  projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
}, {
  transportMode: ["cli"]
});
```

See [Configuration](/docs/configuration) for more information.
