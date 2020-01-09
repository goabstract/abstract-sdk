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

export default class Users extends Endpoint {
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
