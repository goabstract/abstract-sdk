---
id: index
title: Docs
---

## Setup

1. Create a [Abstract authentication token](https://app.goabstract.com)
1. `npm install abstract-js`

## Usage

```js
import * as Abstract from "abstract-js";

const abstract = Abstract.Client({
  abstractToken: "ABSTRACT_TOKEN"
});
```

Everything below is optional, [see API for what's possible](api.md)✨

---

## Changing transport

```js
const abstract = Abstract.Client({
  transport: Abstract.AUTO // default
  // transport: Abstract.API // api only
  // transport: Abstract.CLI // cli only
});
```

## Changing abstract-cli path

Paths are relative to `process.cwd()`

```js
Abstract.Client({
  abstractCliPath: [ // default
    "./abstract-cli",
    "./node_modules/@elasticprojects/abstract-cli"
  ]
});
```

## Using environment variables

See [using environment](environment.md)
