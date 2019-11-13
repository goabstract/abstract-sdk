// @flow
import type {
  NewWebhook,
  OrganizationDescriptor,
  Webhook,
  WebhookDelivery,
  WebhookDeliveryDescriptor,
  WebhookDescriptor,
  WebhookEvent
} from "../types";
import Endpoint from "./Endpoint";

export default class Users extends Endpoint {
  list(descriptor: OrganizationDescriptor) {
    return this.request<Promise<Webhook[]>>({
      api: async () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks`
        );
      }
    });
  }

  info(descriptor: WebhookDescriptor) {
    return this.request<Promise<Webhook>>({
      api: async () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}`
        );
      }
    });
  }

  events(descriptor: OrganizationDescriptor) {
    return this.request<Promise<WebhookEvent[]>>({
      api: () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/events`
        );
      }
    });
  }

  create(descriptor: OrganizationDescriptor, webhook: NewWebhook) {
    return this.request<Promise<Webhook>>({
      api: () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/subscribe`,
          {
            method: "POST",
            body: {
              subscription: webhook
            }
          }
        );
      }
    });
  }

  update(descriptor: OrganizationDescriptor, webhook: Webhook) {
    return this.request<Promise<Webhook>>({
      api: () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/subscribe`,
          {
            method: "POST",
            body: {
              subscription: webhook
            }
          }
        );
      }
    });
  }

  delete(descriptor: WebhookDescriptor) {
    return this.request<Promise<void>>({
      api: async () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/unsubscribe`,
          { method: "DELETE" }
        );
      }
    });
  }

  ping(descriptor: WebhookDescriptor) {
    return this.request<Promise<void>>({
      api: async () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/ping`,
          { method: "POST" }
        );
      }
    });
  }

  deliveries(descriptor: WebhookDescriptor) {
    return this.request<Promise<WebhookDelivery[]>>({
      api: async () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/deliveries`
        );
      }
    });
  }

  redeliver(descriptor: WebhookDeliveryDescriptor) {
    return this.request<Promise<void>>({
      api: async () => {
        return this.apiRequest(
          `organizations/${descriptor.organizationId}/webhooks/${descriptor.webhookId}/deliveries/${descriptor.deliveryId}/redeliver`,
          { method: "POST" }
        );
      }
    });
  }
}
