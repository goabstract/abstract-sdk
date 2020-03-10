// @flow
/* istanbul ignore file */

import Client from "./Client";
import { inferShareId } from "./util/helpers";
import { paginate } from "./paginate";
/**
 * This package contains a selection of utilities for dealing with documents inside of Sketch.
 * <div class="banner banner-warning">
 *  All of these methods except isSketchPlugin rely on the official
 *  Abstract plugin being available and can only be used when the SDK
 *  is running inside the context of a Sketch plugin.
 * </div>
 */
import * as sketch from "./sketch";

import {
  BaseError,
  EndpointUndefinedError,
  FileAPIError,
  FileExportError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError
} from "./errors";

export {
  // Core API
  Client,
  // Custom errors
  BaseError,
  EndpointUndefinedError,
  FileAPIError,
  FileExportError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  UnauthorizedError,
  // Utilities
  inferShareId,
  paginate,
  sketch
};

export type * from "./types";

/**
 * @name Introduction
 * @description
 * <h1>Abstract SDK</h1>
 * <p>A universal javascript binding for the Abstract API and CLI</p>
 * <a href="https://sdk.goabstract.com/docs/installation">Get Started</a>
 * <a href="https://github.com/goabstract/abstract-sdk">GitHub</a>
 * <ul>
 * <li>
 * <h3>API</h3>
 * <p>Abstract is built on an extensive HTTP API, you can use the
 * SDK to access the data stored in Abstract from servers,
 * other apps, or CI environments.
 * </p>
 * </li>
 * <li>
 * <h3>CLI</h3>
 * <p>The Abstract desktop application comes with an embedded CLI.
 * This SDK provides an easy and consistent interface to accessing
 * your data stored locally in Abstract.
 * </p>
 * </li>
 * </ul>
 */

/**
 * @name RateLimits
 * @description
 * When using the SDK with the API transport, requests are subject to a flat rate limit of 120 requests per minute. This helps to ensure API stability and helps to prevent misuse of Abstract servers. Rate limits are issued on a per-token basis rather than per-client; this means that multiple clients configured to use the same token will exhaust the same rate limit.
 * <div class="banner banner-warning">
 * Rate limits can be avoided altogether by using the CLI transport. See Transports for information.
 * </div>
 * <h3>Managing rate limits</h3>
 * If an SDK client issues too many requests over a given time period, an <code>Abstract.RateLimitError</code> will be thrown that contains information that can be used to safely resume requests. The <code>resetsAt</code> property is an epoch timestamp indicating when the rate limit resets.
 * @example
 * try {
 *   // Query all projects
 *   const projects = await client.projects.list();
 * } catch (error) {
 *   if (error instanceof Abstract.RateLimitError) {
 *     // Query all projects again
 *     setTimeout(() => {
 *       const projects = await client.projects.list();
 *     },
 *     // Wait until the rate limit resets
 *     error.data.resetsAt - Date.now());
 *   }
 * }
 *
 */

/**
 * @name Transports
 * @description
 * The SDK can be configured to use different data sources - known as "transports" - that each have unique advantages.
 * <div class="banner banner-warning">
 *  Some SDK methods are only available when using a specific transport.
 *  Check the <a href="#api-reference">API reference</a> for more information.
 * </div>
 *
 * <h3>API</h3>
 * The Abstract API is a transport mode that uses HTTP to interact with Abstract's own hosted servers.
 * This transport is especially useful in remote execution environments since it
 * does not require the Abstract desktop application or data on the local disk.
 * This transport requires authentication and requests are subject to rate limits.
 *
 * <h3>CLI</h3>
 * The Abstract CLI is a transport mode that uses the Abstract desktop application
 * to interact with data stored locally on a given machine.
 * This transport does not require internet connectivity or authentication,
 * and requests are not subject to rate limits.
 * This transport does require access to the Abstract desktop application
 * and its underlying data, as such it can only be used on macOS currently.
 *
 * <h3>Using a specific transport</h3>
 * The SDK currently uses the API transport by default, but this could change in the future.
 * For the most resilient configuration, it's recommended to explicitly set the
 * transport mode that works best for your SDK use case.
 * All SDK methods accept an options object as their last argument.
 * This object can be used to specify a one-time transportMode that
 * overrides the global transportMode for a given SDK operation.<br>
 * See <a href="#configuration">Configuration</a> for more information.
 *
 * @example
 * const client = new Abstract.Client({
 *   transportMode: ["api", "cli"]
 * });
 * @example
 * // Globally configure both an API and a CLI transport
 * const client = new Abstract.Client({
 *   transportMode: ["api", "cli"]
 * });
 * // Only use a CLI transport for this operation
 * client.branches.list({
 *   projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
 * }, {
 *   transportMode: ["cli"]
 * });
 */

/**
 * @name Pagination
 * @description
 * Some SDK methods return large result sets thatcan be
 * difficult to workwith because of how many items they contain.
 * To make working with such large sets easier and more efficient,
 * these methods return a few items at a time in smaller sets called "pages".<br>
 * This section explains how to use these pages of results within the SDK.
 *
 * <h3>Cursor pagination</h3>
 * Instead of returning all results at once, paginated SDK methods return a cursor object.
 * A cursor object contains a small portion of results - or a page - along with a
 * function that can be called to fetch additional pages.
 * Instead of manually managing options like <code>offset</code>, a cursor can be used
 * to iteratively and automatically move through pages of results.
 *
 * In practice, paginated methods return a special type of
 * <code>Promise</code> that contains a <code>next</code> method.
 * This special <code>Promise</code> - called a <code>CursorPromise</code> - resolves
 * to the current page of results.
 * Its <code>next</code> method returns another <code>CursorPromise</code>
 *  that resolves to the next page of results, or <code>undefined</code> if none exist.
 * @example
 * // Use an SDK client instance to fetch the first ten activities for a project.
 * const firstPage = client.activities.list({
 *   projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
 * }, { limit: 10 });
 *
 * @example
 * // Since firstPage is a CursorPromise, it will resolve to the first ten activities.
 * // Its next method can be used to fetch the next page of activities.
 * const firstPage = client.activities.list({
 *   projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
 * }, { limit: 10 });
 *
 * const firstPageResponse = await firstPage;
 *
 * const secondPage = firstPage.next();
 * const secondPageResponse = await secondPage;
 *
 * console.log(`First Page: ${firstPageResponse.length}, Second Page: ${secondPageResponse.length}`);
 *
 * @example
 * // Putting this all together, all activities could be fetched using recursion.
 * async function fetchActivities(request) {
 *   const response = await request;
 *   if (!response) return;
 *   console.log(`Result page: ${response.length} items`);
 *   fetchActivities(request.next());
 * }
 *
 * fetchActivities(client.activities.list({
 *   projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
 * }, { limit: 10 }));
 *
 * <div class="banner banner-warning">
 *  Note: This <code>paginate</code> utility function and the asynchronous iteration
 *  support it provides are currently experimental and may not work as expected.
 * </div>
 * @example
 * // The SDK also offers a convenience paginate function to wrap any CursorPromise with an AsyncIterable interface.
 * // This allows all cursor-paginated methods to also be used with for-await-of asynchronous iteration.
 * const iterable = paginate(client.activities.list({
 *   projectId: 'b8bf5540-6e1e-11e6-8526-2d315b6ef48f'
 * }, { limit: 10 }));
 *
 * (async () => {
 *   for await (const page of iterable) {
 *     console.log('Items: ', page.length);
 *   }
 * })();
 */

/**
 * @name Webhook
 * @description
 * Webhooks make it easy to efficiently subscribe to events across the Abstract platform.
 * Whenever one of these events is triggered by some action in either
 * the web or desktop Abstract application, an HTTP <code>POST</code> request
 * will be sent to a user-configured URL.
 * Many powerful SDK use cases rely on this ability to execute logic
 * in response to a specific Abstract event.
 * This is especially useful when configuring a continuous integration flow
 * where an action is taken any time new events occur within a given project or branch.
 * Possible Abstract integrations include:
 * - Slack integration
 * - Automatic icon generation
 * - Static preview generation
 *
 * <div class="banner banner-warning">
 * Webhooks are currently in beta.
 * Please note that payloads, event names, and other related
 * functionality could change before launching publicly.
 * <a href="https://docs.google.com/forms/d/e/1FAIpQLSevRBz_upT8p2YrieDRrlIKyAUAOHQ5A1xZFn2AMLlrae2rOA/viewform">Request beta access now</a>
 * </div>
 * <h3>Creating a webhook</h3>
 * Webhooks are specific to an organization and can be created via its integration settings.
 * The following process outlines how to create a new webhook.
 * <ol>
 * <li>Go to the <strong>Integrations</strong> settings page.</li>
 * <li>Click the  <strong>Add Webhook</strong> button.</li>
 * <li>Configure a receiving HTTPS endpoint URL.</li>
 * <li>
 *   Optionally configure a signing key to enable
 *   <a href="#webhooks-security">signature verification</a>
 *   <div class="banner banner-warning">
 *     Keep signing keys somewhere safe! After initial creation,
 *     the underlying value won't be visible again.
 *   </div>
 * </li>
 * <li>Configure events that should trigger deliveries.</li>
 * <li>Click the <strong>Add Webhook</strong> button.</li>
 * </ol>
 * <img src="https://sdk.goabstract.com/img/create-webhook-animated.gif"  width="200" alt="Create a webhook">
 *
 * <h3>Managing a webhook</h3>
 * Existing webhooks can be managed via an organization's integration settings. Webhooks can be tested, updated, and deleted, and their successful and unsuccessful delivery attempts can be viewed and inspected.
 * <ol>
 *  <li>Go to the <strong>Integrations</strong> settings page.</li>
 *  <li>Select an existing webhook.</li>
 *  <li>Test, update, or delete the webhook.</li>
 * </ol>
 * <img src="https://sdk.goabstract.com/img/manage-webhook-animated.gif" alt="Manage a Webhook" width="200">
 */

/**
 * @name WebhooksSecurity
 * @description
 * After configuring a new webhook and a server to listen for deliveries,
 * it's a good idea to secure that server against unwanted requests.
 * Specifically, requests should be limited to those that originate from Abstract.
 * While many different methods exist for restricting traffic from unwanted domains,
 * Abstract uses delivery signatures as its primary means of verification.
 * This means that a signature can optionally be computed for each delivery
 * request sent to a webhook's configured endpoint. This signature can then be
 * used to easily verify that a delivery was sent by Abstract.
 *
 * <h3>Configuring a signing key</h3>
 * @description
 * During the creation process for a webhook,
 * an optional signing key can be configured.
 * If a value is provided for this field, signature
 * verification will be enabled, and the signing key will
 * be used as a secret when calculating a signature for each delivery payload.
 *
 * <div class="banner banner-warning">
 * Signing keys should be treated like passwords
 * and should never be committed to version control.
 * </div>
 *
 * See <a href="#webhook">Creating a webhook</a>
 * for more information on creating a webhook with a signing key.
 *
 * <h3>Verifying a delivery</h3>
 * When a webhook has a signing key configured during setup,
 * delivery requests to its endpoint will include an
 * <strong>Abstract-Webhooks-Signature</strong> request header.
 * The value of this header is then compared to the signature
 * of the received payload together with the signing key.
 *
 * <ol>
 *  <li>Sign the delivery payload using the signing key.</li>
 *  <li>Compare this value to the <strong>Abstract-Webhooks-Signature</strong> value.
 * </ol>
 *
 * <h4>Using the SDK</h4>
 * The recommended way to verify webhook deliveries
 * is to use the official <a href="https://sdk.goabstract.com/docs">JavaScript SDK</a>.
 *
 * The SDK exposes a <a href="#webhooksverify">webhooks.verify method</a> specifically intended
 * to verify webhook deliveries. The method accepts a delivery payload,
 * the <code>Abstract-Webhooks-Signature</code> header, and the webhook's configured
 * signing key, and returns a <code>Promise</code> that resolves to a
 * <code>boolean</code> indicating verification status.
 *
 * <h4>Manually</h4>
 * While using the official SDK is the recommended way to verify
 * webhook deliveries, manual verification can be used instead.
 *
 * A delivery's signature is created by generating a hash-based
 * message authentication code (<a href="https://en.wikipedia.org/wiki/HMAC">HMAC</a>) of the request body
 * using the <a href="https://en.wikipedia.org/wiki/SHA-2">SHA-256</a> digest algorithm.
 *
 * <ol>
 *  <li>
 *    <p><strong>Sign the delivery payload</strong></p>
 *    <p>Compute an HMAC using SHA-256 using the delivery request
 *       body as the message and the webhook's configured signing key as the key.</p>
 *  </li>
 *  <li>
 *    <p><strong>Compare to <code>Abstract-Webhooks-Signature</code></strong></p>
 *    <p>Compare the calculated signature to the signature provided in the header.
 *       If the two signatures are equal, you can be sure that the request is verified
 *       and was sent by Abstract.</p>
 *  </li>
 * </ol>
 *
 * @example
 * // Using the SDK
 * const abstract = require("abstract-sdk");
 * const bodyParser = require("body-parser");
 * const express = require("express");
 *
 * const client = new abstract.Client();
 * const app = express();
 *
 * app.use(bodyParser.json());
 *
 * app.post("/webhook", async (req, res) => {
 *   const payload = req.body;
 *   const expectedSignature = req.header("Abstract-Webhooks-Signature");
 *   const signingKey = process.env.WEBHOOK_SIGNING_KEY;
 *   const verified = await client.webhooks.verify(payload, expectedSignature, signingKey);
 *
 *   if (!verified) {
 *     res.status(500).send("Webhook payload could not be verified.");
 *     return;
 *   }
 *
 *   // Webhook verified, do something with payload data...
 * });
 *
 * app.listen(1337);
 *
 *
 * @example
 * // Manually
 * const bodyParser = require("body-parser");
 * const express = require("express");
 * const sha256 = require("js-sha256");
 *
 * const app = express();
 *
 * app.use(bodyParser.json());
 *
 * app.post("/webhook", (req, res) => {
 *  const payload = req.body;
 *  const expectedSignature = req.header("Abstract-Webhooks-Signature");
 *  const signingKey = process.env.WEBHOOK_SIGNING_KEY;
 *  const signature = sha256.hmac(signingKey, JSON.stringify(payload));
 *
 *  if (signature !== expectedSignature) {
 *    res.status(500).send("Webhook payload could not be verified.");
 *    return;
 *  }
 *
 * // Webhook verified, do something with payload data...
 * });
 *
 * app.listen(1337);
 *
 */

/**
 * @name LatestCommits
 * @description
 * When using the SDK to query for various types of resources,
 * it's common to pass in an <code>sha</code> property to limit
 * results to a specific commit on a given project branch.
 * In addition to specifying an actual SHA hash, the latest commit
 * can always be targeted by passing the string <code>"latest"</code>.
 * For example, it's possible to fetch all files for the latest commit on
 * the master branch of a project without knowing the actual commit hash:
 *
 * @example
 * client.files.list({
 *   branchId: "master",
 *   projectId: "b22d7d80-d198-11e8-9718-e3d50f1a1b38",
 *   sha: "latest"
 * });
 */

/**
 * @name Embeds
 * @description
 * Embeds can be used to display interactive, up-to-date previews
 * for layers and collections in any environment that supports HTML.
 *
 * To use an embed, create an <code>iframe</code> with a special URL
 * derived from public share URLs.
 * <div class="banner banner-warning">
 * Note: Only links for publicly-shared layers or collections can be embedded at this time.
 * </div>
 * <h3>Generating an embed</h3>
 * <div id="embed-gen">
 *   <input id="embed-input" type="text" placeholder="Paste a public share link, e.g. https://share.goabstract.com/..." />
 *   <div id="embed" class="button" >EMBED</div>
 *   <div id="waiting">Waiting for share link...</div>
 *   <div id="copy" class="button" >COPY</div>
 *   <script>
 *   (() => {
 *    const container = document.querySelector('#embed-gen');
 *    const copy = document.querySelector('#copy');
 *    const input = document.querySelector('#embed-input');
 *    const waiting = document.querySelector('#waiting');
 *    const shareLinkPattern = /^https?:\/\/share\.(go)?abstract\.com/;
 *    function generateCode() {
 *      container.classList.remove('done');
 *      copy.classList.remove('copied');
 *      const urlDiv = document.querySelector('#embed-gen + pre > code > .hljs-tag:first-child > .hljs-string:nth-child(3)');
 *      if (!shareLinkPattern.test(input.value)) {
 *        waiting.innerHTML = 'Invalid share link. Please try again...';
 *        return;
 *      }
 *      const embedUrl = input.value.replace(shareLinkPattern, 'https://app.abstract.com/embed');
 *      urlDiv.innerHTML = `"${embedUrl}"`;
 *      container.classList.add('done');
 *    }
 *    function copyCode() {
 *      const code = document.querySelector('#embed-gen + pre > code');
 *      const textarea = document.createElement('textarea');
 *      textarea.classList.add('hidden');
 *      document.body.appendChild(textarea);
 *      textarea.value = code.innerText;
 *      textarea.select();
 *      document.execCommand('copy');
 *      textarea.parentElement.removeChild(textarea);
 *      copy.classList.add('copied');
 *      setTimeout(() => {
 *        copy.classList.remove('copied');
 *      }, 2000);
 *    }
 *    document.querySelector('#embed').addEventListener('click', generateCode);
 *    copy.addEventListener('click', copyCode);
 *  })();
 *</script>
 *</div>
 */

/**
 * @name FullResponses
 * @description
 * Some SDK methods return extra data in addition to the data
 * that's actually being requested. This extra data can be helpful
 * in many cases, and can sometimes mitigate future SDK requests
 * for additional data. For example, when requesting a collection,
 * the underlying API also returns all <code>files</code>, <code>pages</code>, and <code>layers</code>
 * within that collection.
 *
 * <h3>Accessing full response data</h3>
 * By default, the SDK only exposes the data that's explicitly
 * being requested. This means that if a collection is requested,
 * only that collection will be returned, and that none of the
 * collection's supporting data - like its <code>files</code>, <code>pages</code>, and <code>layers</code> -
 * will be returned. While this behavior is fine for most use cases,
 * some advanced integrations rely on accessing the full response from
 * a given transport.
 *
 * The SDK provides an <code>unwrap</code> method on client instances
 * that can be used to access the full response as sent by a given transport.
 *
 * @example
 * const collection = await client.collection.info({ ... });
 * const { files, pages, layers } = client.unwrap(collection);
 *
 */

/**
 * @name Installation
 * @description
 * The SDK is available as an NPM package and can be installed using a package manager like NPM or Yarn. An underlying Node.js version of 10.0.0 or higher is required.
 * @example
 * npm install "abstract-sdk"
 */

/**
 * @name Authentication
 * @description
 *   Authentication with the SDK uses OAuth access tokens that are generated using the Abstract web application.
 * <div class="notice">Access tokens should be treated like passwords, as they enable access to all data that a given account can access. Do not commit them to version control.</div>
 * <h4>Generating an access token</h4>
 * <ol>
 *  <li>Visit the <a href="https://app.goabstract.com/account/tokens">access token settings</a> page.</li>
 *  <li>Click the <strong>Create API Token</strong> button.</li>
 *  <li>Name the token descriptively and save it.</li>
 *</ol>
 *<img src="https://sdk.goabstract.com/img/create-token.png" style="display: block;" alt="Create Token modal window" width="100">
 *After creating an access token, copy it to the clipboard to save to a different location, like an ABSTRACT_TOKEN environment variable. It's important to actually save the access token and to give it a descriptive name: after initial creation, the underlying value won't be visible again.
 *<h4>Using an access token</h4>
 *If an access token is available in a given environment as an ABSTRACT_TOKEN variable, the SDK will automatically use it without any additional configuration. It's also possible to explicitly pass in an access token using the accessToken configuration option.<br>
 *An access token can be passed directly as a string.
 *<pre class="p1 overflow-auto round fill-light">
 *<span class="hljs-keyword">const</span> client = <span class="hljs-keyword">new</span> Abstract.Client({
 *  <span class="hljs-attr">accessToken</span>: process.env.DEMO_TOKEN
 *});
 *</pre>
 *An access token can also be passed as either a synchronous or an asynchronous function that returns a string.
 *<pre class="p1 overflow-auto round fill-light"><span class="hljs-keyword">const</span> client = <span class="hljs-keyword">new</span> Abstract.Client({
 *  <span class="hljs-attr">accessToken</span>: <span class="hljs-keyword">async</span> () =&gt; getDemoToken()
 *});</pre>
 */

/**
 * @name Configuration
 * @description
 * To use the SDK in an application, a client must be imported from the abstract-sdk NPM package and instantiated with configuration options.
 * <pre class="p1 overflow-auto round fill-light"><span class="hljs-keyword">const</span> client = <span class="hljs-keyword">new</span> Abstract.Client({
 * <span class="hljs-comment">// Configuration options...</span>
 * });</pre>
 * To look at configuration options, refer to <a href="#client">Client</a>
 */

/**
 * @name Usage
 * @description
 * An SDK client instance exposes different namespaces for different types of resources, like client.projects or client.comments. Each of these namespaces exposes various query methods, like client.projects.list() or client.projects.info().<br>
 * See the <a href="#api-reference">API reference</a> for all available namespaces and their methods.
 * <h4>Basic usage</h4>
 * The following example demonstrates how to query all available projects. All SDK methods are asynchronous and return a Promise.
 * <pre class="p1 overflow-auto round fill-light"><span class="hljs-keyword">const</span> projects = <span class="hljs-keyword">await</span> client.projects.list();
 * projects.map(<span class="hljs-function"><span class="hljs-params">project</span> =&gt;</span> {
 *   <span class="hljs-built_in">console</span>.log(<span class="hljs-string">`<span class="hljs-subst">${project.name}</span>: <span class="hljs-subst">${project.id}</span>`</span>);
 * });</pre>
 * <h4>Complete example</h4>
 * The following example demonstrates how to authenticate, configure, then use the SDK to query all available projects.
 * <pre class="p1 overflow-auto round fill-light">
 * <span class="hljs-comment">// Import the SDK client</span>
 * <span class="hljs-keyword">import</span> * <span class="hljs-keyword">as</span> Abstract <span class="hljs-keyword">from</span> <span class="hljs-string">"abstract-sdk"</span>;
 *
 * <span class="hljs-comment">// Create a client</span>
 * <span class="hljs-keyword">const</span> client = <span class="hljs-keyword">new</span>Abstract.Client({
 * <span class="hljs-comment">// Use the cli if available, otherwise use the api</span>
 * <span class="hljs-attr">transportMode</span>: [<span class="hljs-string">"cli"</span>, <span class="hljs-string">"api"</span>]
 * });
 *
 * <span class="hljs-keyword">async</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">run</span>(<span class="hljs-params"></span>) </span>{
 * <span class="hljs-comment">// Query all projects</span>
 * <span class="hljs-keyword">const</span> projects = <span class="hljs-keyword">await</span> client.projects.list();
 * <span class="hljs-comment">// Iterate through each project</span>
 * <span class="hljs-keyword">for</span> (<span class="hljs-keyword">const</span> project <span class="hljs-keyword">of</span> projects) {
 * <span class="hljs-comment">// Log the number of branches</span>
 * <span class="hljs-keyword">const</span> branches = <span class="hljs-keyword">await</span> client.branches.list({ <span class="hljs-attr">projectId</span>: project.id });
 * <span class="hljs-built_in">console</span>.log(<span class="hljs-string">`<span class="hljs-subst">${project.name}</span>: <span class="hljs-subst">${branches.length}</span> branches`</span>);
 * }
 * }
 * run();
 * </pre>
 *
 * <h4 id="going-further">Going further</h4>
 * The example above demonstrates basic SDK authentication, configuration, and usage.
 * From here, it's possible to use the <a href="#api-reference">API reference</a> to dig deeper.
 * Try loading branches, commits, comments, artboard data, and more.
 */
