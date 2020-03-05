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
export const RateLimits = "";
