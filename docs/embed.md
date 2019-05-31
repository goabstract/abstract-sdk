---
id: embed
title: Embeds
---

Embeds can be used to display interactive, up-to-date previews for layers and collections in any environment that supports HTML. To use an embed, create an `<iframe>` with special URL derived from public share URLs.

> Note: Only links for layers that are publicly shared can be embedded.

## Creating an embed

Given a public share url:

`https://share.goabstract.com/c1182fa5-41d4-4f51-a0e2-5506264b65bd`

An embed can be created by using the following URL as the `src` of an `<iframe>`:

`https://app.goabstract.com/embed/c1182fa5-41d4-4f51-a0e2-5506264b65bd`

## Example

```html
<iframe
  src="https://app.goabstract.com/embed/c1182fa5-41d4-4f51-a0e2-5506264b65bd"
  width="640"
  height="360"
  frameborder="0"
></iframe>
```

<iframe src="https://app.goabstract.com/embed/c1182fa5-41d4-4f51-a0e2-5506264b65bd" width="640" height="360" frameborder="0"></iframe>
