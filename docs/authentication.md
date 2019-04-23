---
id: authentication
title: Authentication
---

Authentication with the SDK uses OAuth access tokens that are generated using the Abstract web application.

> Access tokens should be treated like passwords, as they enable access to all data that a given account can access. Do not commit them to version control.

## Generating an access token

1. Visit the [access token settings](https://app.goabstract.com/account/tokens) page.
2. Click the **Create API Token** button.
3. Name the token descriptively and save it.

![Create a token](/img/create-token.png)

After creating an access token, copy it to the clipboard to save to a different location, like an `ABSTRACT_TOKEN` environment variable. It's important to actually save the access token and to give it a descriptive name: after initial creation, the underlying value won't be visible again.

## Using an access token

If an access token is available in a given environment as an `ABSTRACT_TOKEN` variable, the SDK will automatically use it without any additional configuration. It's also possible to explicitly pass in an access token using the `accessToken` configuration option.

An access token can be passed directly as a string.

```js
const client = new Abstract.Client({
  accessToken: process.env.DEMO_TOKEN
});
```

An access token can also be passed as either a synchronous or an asynchronous function that returns a string.

```js
const client = new Abstract.Client({
  accessToken: async () => getDemoToken()
});
```

See [Configuration](/docs/configuration) for more information.
