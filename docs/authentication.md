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

## OAuth

> Current OAuth implementation works only on server-side environments.

In order to authorize with oauth, an application shall be created first.
1. Go to Abstract Personal Settings
2. Choose 'Applications' in the left Pane
3. Click 'Create an Application' and fill the data
4. Copy Client Id and Client Secret

(screenshot of modal with name and desc fields)

Then add clientId, clientSecret and redirectUri when setting up your client.

- `clientId` - id of the application;
- `clientSecret` - application secret;
- `redirectUri` - link to what url user will be redirected after accepting authorization to your application.

```js
const abstract = new Abstract.Client({
  clientId,
  clientSecret,
  redirectUri
});
```

### OAuth flow

After setting up OAuth application credentials, authorization url should come in place.
You can easily generate authentication link with [`abstract.oauth.generateAuthorizeUrl()`](/docs/abstract-api#generate-authorization-url)

```js
client.oauth.generateAuthorizeUrl() // https://app.abstract.com/signin/auth/authorize/?client_id=fff3a82f-607c-465e-925c-8af7e123cb82&redirect_uri=https%3A%2F%2Fexample.com&response_type=code&scope=all&state=abcd
```

After user has accepted/rejected to share his Abstract credentials with the application,
he gets redirected to your application url page, where you have to parse `?code=` from url search parameters.

```
https://example.com/?code=064a5cd32dcea1c03c8f1815ca7817bec9573c3d368156e60eb962fcc99ab408&state=abcd
```

When you're done with that, use [`abstract.oauth.getToken()`](/docs/abstract-api#get-token) and [`abstract.setToken()`](/docs/abstract-api#set-token) to authenticate user with the code from url and set accessToken.

```js
const response = await abstract.oauth.getToken({ authorizationCode: code })
response.then(accessToken => client.setToken(accessToken))
// use sdk as usual
```
