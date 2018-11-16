---
id: authentication
title: Authentication
---

Authentication with the SDK is achieved by using an OAuth access token. During the beta period you will need to [fill out this form to get access to the API](https://docs.google.com/forms/d/e/1FAIpQLSfJMH-mGdlcE4Rfi8-1UzrTBPsx3qCHhkwF9J-DJrdrw6flJQ/viewform) and we'll get back you.

  > API tokens should be treated like a password, as they provide access to all data that your user has access to. Do not commit them to version control.

## Usage

To use the token simply save it in your environment as `ABSTRACT_TOKEN` and it will automatically be used. You can also use another method to load the token and pass it to the SDK on initialization – see [Getting Started](/docs/getting-started) for more details.
