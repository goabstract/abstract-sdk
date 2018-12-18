---
id: configuration
title: Configuration
---

In order to use the SDK you'll need to instantiate a client and give it an [authentication](/docs/authentication) token. We recommend storing the token in your environment as `ABSTRACT_TOKEN` and it will be automatically loaded – don't commit it with your code!

## Passing a token

When an SDK client is created, it will automatically look for a token using the `ABSTRACT_TOKEN` environment variable. This means that no token has to be specified during instantiation.

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client();
```

It's also possible to pass in a token directly if necessary.

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  accessToken: process.env.ABSTRACT_API_TOKEN
});
```

You pass a function that returns a token.

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  accessToken: () => Cookies.get("abstractToken")
});
```

And you can pass a function that returns a promise to a token.

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  accessToken: () => {
    return new Promise(resolve => resolve(Cookies.get("abstractToken")));
  }
});
```

## Transports

If you want to ensure that the SDK only ever loads data from the API or the CLI then you can achieve this by specifying a transport. This is useful when running in an environment without the Mac application installed or alternatively when you want to ensure you're only dealing with local data:

```js
import * as Abstract from "abstract-sdk";

const abstract = Abstract.Client({
  transport: Abstract.TRANSPORTS.CLI // or Abstract.TRANSPORTS.API
});
```
