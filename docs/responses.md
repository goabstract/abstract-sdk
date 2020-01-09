---
id: responses
title: Full Responses
---

Some SDK methods return extra data in addition to the data that's actually being requested. This extra data can be helpful in many cases, and can sometimes mitigate future SDK requests for additional data. For example, when requesting a collection, the underlying API also returns all `files`, `pages`, and `layers` within that collection.

## Accessing full response data

By default, the SDK only exposes the data that's explicitly being requested. This means that if a collection is requested, only that collection will be returned, and that none of the collection's supporting data - like its `files`, `pages`, and  `layers` - will be returned. While this behavior is fine for most use cases, some advanced integrations rely on accessing the full response from a given transport.

The SDK provides an `unwrap` method on client instances that can be used to access the full response as sent by a given transport.

```js
const collection = await client.collection.info({ ... });
const { files, pages, layers } = client.unwrap(collection);
```