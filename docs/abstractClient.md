---
id: abstractClient
title: Docs
---

# Setup

1. Create a [Abstract authentication token](https://app.goabstract.com)
1. `npm install abstract-js`

# Usage

```js
import { abstractClient, AUTO } from "abstract-js";

const abstract = abstractClient({
  abstractToken: "ABSTRACT_TOKEN"
});
```

Everything below is optional, see [API](#api) to see what's possible. ✨

---

# Change transport

```js
import { AUTO, API, CLI } from "abstract-js";

const abstract = abstractClient({
  transport: AUTO // default
  // transport: API, // api only
  // transport: CLI, // cli only
});
```

# Change abstract-cli path

Relative paths are relative to `process.cwd()`

```js
abstractClient({
  abstractCliPath: [ // default
    "./abstract-token",
    "./node_modules/@elasticprojects/abstract-cli"
  ]
});
```
