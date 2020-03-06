// @flow
import sha256 from "js-sha256";
import type {
  NewWebhook,
  OrganizationDescriptor,
  RequestOptions,
  Webhook,
  WebhookDelivery,
  WebhookDeliveryDescriptor,
  WebhookDescriptor,
  WebhookEvent
} from "../types";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";

/**
 *
 *
 * @export
 * @class Webhooks
 * @extends {Endpoint}
 * @description
 * Webhooks make it easy to efficiently subscribe to events across the Abstract platform.
 * Webhooks live at the organization level, and organization administrators can
 * create new webhooks within an organization's settings in the web application.
 * <div class="banner banner-warning">
 *  Note: Additional information on webhooks can be found <a href="#webhook">here</a>.
 * </div>
 */
export default class Users extends Endpoint {
  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<Webhook[]>}
   * @memberof Webhooks
   * @description
   * List an organization's webhooks
   * @example
   * // List all webhooks for a given organization
   * abstract.webhooks.list({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * });
   */
  list(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Webhook[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {WebhookDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<WebhookType>}
   * @memberof Webhooks
   * @description
   * Retrieve a webhook
   * @example
   * // Retrieve a single webhook
   * abstract.webhooks.info({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
   *  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
   * });
   */
  info(descriptor: WebhookDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<Webhook>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<WebhookEvent[]>}
   * @memberof Webhooks
   * @description List available webhook events
   * @example
   * // List all available webhook events
   * abstract.webhooks.events({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * });
   */
  events(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<WebhookEvent[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/events`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {NewWebhook} webhook
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<WebhookType>}
   * @memberof Webhooks
   * @description Create a Webhook
   * @example
   * // Create a new webhook
   * abstract.webhooks.create({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * }, {
   *  active: true,
   *  events: [ 'project.created' ],
   *  organizationId: "4ed01dff-4bc7-47cd-8b51-9ea3ec9e5de4",
   *  url: "https://example-url.com/postreceive"
   * });
   */
  create(
    descriptor: OrganizationDescriptor,
    webhook: NewWebhook,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Webhook>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/subscribe`,
          {
            method: "POST",
            body: {
              subscription: webhook
            }
          }
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {OrganizationDescriptor} descriptor
   * @param {Webhook} webhook
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<WebhookType>}
   * @memberof Webhooks
   * @description Update a webhook
   * @example
   * // Update an existing webhook
   * abstract.webhooks.update({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9"
   * }, {
   *  active: false,
   *  events: [ 'project.updated' ],
   *  organizationId: "4ed01dff-4bc7-47cd-8b51-9ea3ec9e5de4",
   *  url: "https://another-example-url.com/postreceive"
   * });
   */
  update(
    descriptor: OrganizationDescriptor,
    webhook: Webhook,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Webhook>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/subscribe`,
          {
            method: "POST",
            body: {
              subscription: webhook
            }
          }
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {WebhookDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<void>}
   * @memberof Webhooks
   * @example
   * abstract.webhooks.delete({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
   *  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
   * });
   */
  delete(descriptor: WebhookDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<void>>({
      api: () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/unsubscribe`,
          { method: "DELETE" }
        );
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {WebhookDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<void>}
   * @memberof Webhooks
   * @description Send a test event to a webhook
   * @example
   * // Send a test event to an existing webhook
   * abstract.webhooks.ping({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
   *  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
   * });
   */
  ping(descriptor: WebhookDescriptor, requestOptions: RequestOptions = {}) {
    return this.configureRequest<Promise<void>>({
      api: () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/ping`,
          { method: "POST" }
        );
      },
      requestOptions
    });
  }

  /**
   *
   *
   * @param {WebhookDescriptor} descriptor
   * @param {RequestOptions} [requestOptions={}]
   * @returns {Promise<WebhookDelivery[]>}
   * @memberof Webhooks
   * @description
   * List all deliveries for a webhook
   * @example
   * abstract.webhooks.deliveries({
   *  organizationId: "d147fba5-c713-4fb9-ab16-e7e82ed9cbc9",
   *  webhookId: "03df2308-82a7-4a05-b9e9-c31ad569249d"
   * });
   */
  deliveries(
    descriptor: WebhookDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<WebhookDelivery[]>>({
      api: async () => {
        const response = await this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/deliveries`
        );
        return wrap(response);
      },
      requestOptions
    });
  }

  redeliver(
    descriptor: WebhookDeliveryDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<void>>({
      api: () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/deliveries/${descriptor.deliveryId}/redeliver`,
          { method: "POST" }
        );
      },
      requestOptions
    });
  }

  /**
   *
   * @param {*} payload
   * @param {string} expectedSignature
   * @param {string} signingKey
   * @param {RequestOptions} [requestOptions={}]
   * @description Verify a webhook delivery
   * <div class="banner banner-warning">
   *  Note: This endpoint is intended to be used on a webhook server to verify
   *  that incoming delivery requests were sent by Abstract.
   *  More information on webhook security techniques can be found <a href="#webhookssecurity">here</a>.
   * </div>
   * @example
   * // Verify that a webhook delivery payload was sent by Abstract
   * app.post("/webhook", async (req, res) => {
   *  const payload = req.body;
   *  const expectedSignature = req.header("Abstract-Webhooks-Signature");
   *  const signingKey = process.env.WEBHOOK_SIGNING_KEY;
   *
   *  const verified = await abstract.webhooks.verify(payload, expectedSignature, signingKey);
   *
   *  // Webhook verified, do something with payload data...
   * });
   */
  verify(
    payload: any,
    expectedSignature: string,
    signingKey: string,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<boolean>>({
      api: async () => {
        const signature = sha256.hmac(signingKey, JSON.stringify(payload));
        return signature === expectedSignature;
      },
      requestOptions
    });
  }
}
