---
id: embed
title: Embeds
---

Embeds can be used to display interactive, up-to-date previews for layers and collections in any environment that supports HTML. To use an embed, create an `<iframe>` with a special URL derived from public share URLs.

> Note: Only links for layers or collections that are publicly shared can be embedded.

## Creating an embed

Given a public share url:

`https://share.goabstract.com/c53e8159-2e24-4118-b02b-6fe4b3a3afee`

An embed can be created by using the following URL as the `src` of an `<iframe>`:

`https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee`

## Examples

The following examples demonstrate both layer and collection embeds created from the above share link.

### Layer embed

```html
<iframe
  src="https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee"
  width="784"
  height="360"
  frameborder="0"
></iframe>
```

<iframe src="https://app.goabstract.com/embed/c53e8159-2e24-4118-b02b-6fe4b3a3afee" width="784" height="360" frameborder="0"></iframe>

### Collection embed

```html
<iframe
  src="https://app.goabstract.com/embed/733ca894-a4bb-43e3-a2b1-dd27ff6d00c4"
  width="784"
  height="360"
  frameborder="0"
></iframe>
```

<iframe src="https://app.goabstract.com/embed/733ca894-a4bb-43e3-a2b1-dd27ff6d00c4" width="784" height="360" frameborder="0"></iframe>
