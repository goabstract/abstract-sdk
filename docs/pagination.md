---
id: pagination
title: Pagination
---

Some SDK methods return large result sets that can be difficult to work with because of how many items they contain. To make working with such large sets easier and more efficient, these methods return a few items at a time in smaller sets called "pages".

This section explains how to use these pages of results within the SDK.

## Cursor pagination

Instead of returning all results at once, paginated SDK methods return a **cursor** object. A cursor object contains a small portion of results - or a page - along with a function that can be called to fetch additional pages. Instead of manually managing options like `offset`, a cursor can be used to iteratively and automatically move through pages of results.

In practice, paginated methods return a special type of `Promise` that contains a `next` method. This special `Promise` - called a `CursorPromise` - resolves to the current page of results. Its `next` method returns another `CursorPromise` that resolves to the next page of results, or `undefined` if none exist.

## Example

The following example demonstrates how to work with pages of results.

1. Use an SDK client instance to fetch the first ten activities for a project.
    ```js
    const firstPage = client.activities.list({
      projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
    }, { limit: 10 });
    ```

2. Since `firstPage` is a `CursorPromise`, it will resolve to the first ten activities. Its `next` method can be used to fetch the next page of activities.
    ```js
    const firstPage = client.activities.list({
      projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
    }, { limit: 10 });

    const firstPageResponse = await firstPage;

    const secondPage = firstPage.next();
    const secondPageResponse = await secondPage;

    console.log(`First Page: ${firstPageResponse.length}, Second Page: ${secondPageResponse.length}`);
    ```

3. Putting this all together, all activities could be fetched using recursion.
    ```js
    async function fetchActivities(request) {
      const response = await request;
      if (!response) return;
      console.log(`Result page: ${response.length} items`);
      fetchActivities(request.next());
    }

    fetchActivities(client.activities.list({
      projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
    }, { limit: 10 }));
    ```

4. The SDK also offers a convenience `paginate` function to wrap any `CursorPromise` with an `AsyncIterable` interface. This allows all cursor-paginated methods to also be used with [`for-await-of` asynchronous iteration](https://github.com/tc39/proposal-async-iteration).
    > Note: This `paginate` utility function and the asynchronous iteration support it provides are currently experimental and may not work as expected.
    
    ```js
    const iterable = paginate(client.activities.list({
      projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
    }, { limit: 10 }));

    (async () => {
      for await (const page of iterable) {
        console.log('Items: ', page.length);
      }
    })();
    ```
