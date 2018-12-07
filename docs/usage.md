---
id: usage
title: Usage
---

The SDK exposes different namespaces for different types of resources, like `abstract.projects` or `abstract.comments`. Each of these namespaces expose various query methods, like `abstract.projects.list()` or `abstract.projects.info()`.

## Basic usage

Lets load a list of accessible projects from the API. All of the methods in the SDK return a `Promise` – you may use traditional `Promise` syntax, or `async` / `await` if your JS runtime supports ES8.

```js
const projects = await abstract.projects.list();

projects.map(project => {
  console.log(`${project.name}: ${project.id}`);
});
```

## Putting it all together

The following example demonstrates how to authenticate, configure, and use the SDK.

```js
// Import the SDK client
import * as Abstract from "abstract-sdk";

// Create a client
const abstract = new Abstract.Client({
    // Specify a specific transport for demo purposes only; if
    // no transport is specified, the SDK chooses automatically.
    transport: Abstract.TRANSPORTS.CLI
});

async function run() {
    // Query all projects
    const projects = await abstract.projects.list();

    // Iterate through each project
    for (const project of projects) {
        // Log the number of branches
        const branches = await abstract.branches.list({ projectId: project.id });
        console.log(`${project.name}: ${branches.length} branches`);
    }
}

run();
```

## Going further

Hopefully the above example demonstrated basic SDK usage and you were able to view a list of projects and their branch counts. From here you can use the [API reference](/docs/abstract-api) to dig deeper – try loading branches, commits, comments, artboard data, and more.
