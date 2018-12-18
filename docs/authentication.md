---
id: authentication
title: Authentication
---

Authentication with the SDK is achieved by using an OAuth access token. You can [generate a personal access token](https://app.goabstract.com/account/tokens) for your own account on the Abstract web app.

After creating an API token, you can copy it to your clipboard to save in a different location, such as an `ABSTRACT_TOKEN` environment variable. It's important to actually save the token and to give it a descriptive name, since after initial creation, the underlying token value won't be visible again.

  > API tokens should be treated like a password, as they provide access to all data that your user has access to. Do not commit them to version control.


## Using a token

To use the token simply save it in your environment as `ABSTRACT_TOKEN` and it will automatically be used. You can also use another method to load the token and pass it to the SDK on initialization – see [Configuration](/docs/configuration) for more details.
