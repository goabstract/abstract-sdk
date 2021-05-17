// @flow
import sha256 from "js-sha256";
import Endpoint from "../endpoints/Endpoint";
import { wrap } from "../util/helpers";
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

export default class Users extends Endpoint {
  name = "webhooks";

  list(
    descriptor: OrganizationDescriptor,
    requestOptions: RequestOptions = {}
  ) {
    return this.configureRequest<Promise<Webhook[]>>("list", {
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
    return this.configureRequest<Promise<Webhook>>("info", {
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
    return this.configureRequest<Promise<WebhookEvent[]>>("events", {
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
    return this.configureRequest<Promise<Webhook>>("create", {
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
    return this.configureRequest<Promise<Webhook>>("update", {
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
    return this.configureRequest<Promise<void>>("delete", {
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
    return this.configureRequest<Promise<void>>("ping", {
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
    return this.configureRequest<Promise<WebhookDelivery[]>>("deliveries", {
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
    return this.configureRequest<Promise<void>>("redeliver", {
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
    return this.configureRequest<Promise<boolean>>("verify", {
      api: async () => {
        const signature = sha256.hmac(signingKey, JSON.stringify(payload));
        return signature === expectedSignature;
      },
      requestOptions
    });
  }
}
