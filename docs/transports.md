---
id: transports
title: Transports
---

The SDK can be configured to use different data sources - known as "transports" - that each have unique advantages.

> Some SDK methods are only available when using a specific transport. Check the [API reference](/docs/abstract-api) for more information.

## API

The Abstract API is a transport mode that uses HTTP to interact with Abstract's own hosted servers. This transport is especially useful in remote execution environments since it requires no backing data infrastructure to be installed locally. This transport requires [authentication](/docs/authentication) and requests are subject to [rate limits](/docs/rate-limits).

## CLI

The Abstract CLI is a transport mode that uses the Abstract desktop application to interact with data stored locally on a given machine. This transport does not require internet connectivity or authentication, and requests are not subject to rate limits. This transport does require access to the Abstract desktop application and its underlying data.


## Auto

The SDK provides an "auto" transport that can be used in environments where both the API and the CLI transports are available. Any time an SDK method is called, the auto transport will first check the CLI, then the API, for an available implementation. This allows transport-specific SDK methods to be called without worrying about which transport is being used. This transport also helps to reduce rate limit errors since the CLI transport will be favored in most cases.

## Using a specific transport

The SDK currently uses the API transport by default, but this could change in the future. For the most resilient configuration, it's recommended to explicitly set the transport mode that works best for your SDK use case.

The `transportMode` configuration option can be used to specify the transport that an SDK client should use.

```js
const client = new Abstract.Client({
  transportMode: "cli"
});
```

See [Configuration](/docs/configuration) for more information.
