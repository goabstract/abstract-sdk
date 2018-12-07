---
id: authentication
title: Authentication
---

Authentication with the SDK is achieved by using an OAuth access token. During the beta period you will need to [fill out this form to get access to the API](https://docs.google.com/forms/d/e/1FAIpQLSfJMH-mGdlcE4Rfi8-1UzrTBPsx3qCHhkwF9J-DJrdrw6flJQ/viewform) and we'll get back you.

  > API tokens should be treated like a password, as they provide access to all data that your user has access to. Do not commit them to version control.

## Creating a token

The following steps will guide you through creating an OAuth token during the beta period.

1. [Fill out this form](https://docs.google.com/forms/d/e/1FAIpQLSfJMH-mGdlcE4Rfi8-1UzrTBPsx3qCHhkwF9J-DJrdrw6flJQ/viewform) to request beta API access.
2. [View your token settings](https://app.goabstract.com/account/tokens) once access is granted.
3. Click **CREATE API TOKEN**, provide a description, and submit.

After creating an API token, you can copy it to your clipboard to save in a different location, such as an `ABSTRACT_TOKEN` environment variable. It's important to actually save the token and to give it a descriptive name, since after initial creation, the underlying token value won't be visible again.

## Using a token

To use the token simply save it in your environment as `ABSTRACT_TOKEN` and it will automatically be used. You can also use another method to load the token and pass it to the SDK on initialization – see [Configuration](/docs/configuration) for more details.