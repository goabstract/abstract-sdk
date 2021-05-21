---
id: configuration
title: Configuration
---

To use the SDK in an application, a client must be imported from the `abstract-sdk` NPM package and instantiated with configuration options.

```js
const client = new Abstract.Client({
  // Configuration options...
});
```

## Configuration options

The following options are available when configuring an SDK client.

### `accessToken`

_Default value: `undefined`_

After [generating an access token](/docs/authentication), this option can be used to pass that token to the SDK. This option accepts strings and both synchronous and asynchronous functions that return strings. Note that the SDK will automatically use an access token saved as an `ABSTRACT_TOKEN` environment variable without any additional configuration; this means that the `accessToken` option is only required when `ABSTRACT_TOKEN` is not set.

See [Authentication](/docs/authentication) for more information.

### `apiUrl`

_Default value: `https://api.goabstract.com`_

This option can be used to specify a custom URL that points to an instance of the Abstract HTTP API. This is used when building the request URLs used by the [API transport](/docs/transports). This option is useful if HTTP requests should be routed locally or through a proxy server.

### `objectUrl`

_Default value: `https://objects.goabstract.com`_

This option can be used to specify a custom URL that points to an instance of the Abstract object retrieval service. This is used when building URLs for static assets including files and assets when using the [API transport](/docs/transports). This option is useful if HTTP requests should be routed locally or through a proxy server.

### `previewUrl`

_Default value: `https://previews.goabstract.com`_

This option can be used to specify a custom URL that points to an instance of the Abstract preview service. This is used when building preview image URLs used by the [API transport](/docs/transports). This option is useful if HTTP requests should be routed locally or through a proxy server.

### `shareId`

This option can be used to pass a share identifier (`string`, [`ShareDescriptor`](/docs/abstract-api/#sharedescriptor), or [`ShareUrlDescriptor`](/docs/abstract-api/#shareurldescriptor)) to access objects associated with a public [share](/docs/abstract-api/#shares) without having to authenticate with an `accessToken`.

### `transportMode`

_Default value: `["api"]`_

The SDK can be configured to use different data sources - known as "transports" - that each have unique advantages. The `transportMode` option can be used to tell an SDK client to try to use a set of transports in a specific order. This can also be overridden on a per-method basis.

See [Transports](/docs/transports) for more information.

### `webUrl`

_Default value: `https://app.goabstract.com`_

This option can be used to specify a custom URL for the Abstract web application. This is used by the [API transport](/docs/transports) when generating URLs that link to specific parts of the web application.

### `proxyAgent`

_Default value: `undefined`_

This option can be used to specify a custom proxy configuration which will be used for routing API requests. We recommend using in conjunction with the [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent) module for most circumstances, which would need to be installed separately. Configuration looks like:


```javascript
const HttpsProxyAgent = require("https-proxy-agent");
const Abstract = require("abstract-sdk");

const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:8080");

// alternatively pass one of the common env variables…
// const proxyAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY);

const client = new Abstract.Client({
  proxyAgent,
  accessToken,
  ...etc
});
```
