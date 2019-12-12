// @flow
import sha256 from "js-sha256";
import { mockAPI, API_CLIENT } from "../../src/util/testing";

describe("webhooks", () => {
  describe("list", () => {
    test("api", async () => {
      mockAPI("/organizations/org-id/webhooks", [
        {
          id: "webhook-id"
        }
      ]);

      const response = await API_CLIENT.webhooks.list({
        organizationId: "org-id"
      });

      expect(response).toEqual([
        {
          id: "webhook-id"
        }
      ]);
    });
  });

  describe("info", () => {
    test("api", async () => {
      mockAPI("/organizations/org-id/webhooks/webhook-id", {
        id: "webhook-id"
      });

      const response = await API_CLIENT.webhooks.info({
        organizationId: "org-id",
        webhookId: "webhook-id"
      });

      expect(response).toEqual({
        id: "webhook-id"
      });
    });
  });

  describe("events", () => {
    test("api", async () => {
      mockAPI("/organizations/org-id/webhooks/events", [
        {
          id: "event-id"
        }
      ]);

      const response = await API_CLIENT.webhooks.events({
        organizationId: "org-id"
      });

      expect(response).toEqual([
        {
          id: "event-id"
        }
      ]);
    });
  });

  describe("create", () => {
    test("api", async () => {
      mockAPI(
        "/organizations/org-id/webhooks/subscribe",
        {
          id: "webhook-id"
        },
        201,
        "post"
      );

      const response = await API_CLIENT.webhooks.create(
        {
          organizationId: "org-id"
        },
        {
          active: true,
          events: [],
          key: "key",
          organizationId: "org-id",
          url: "url"
        }
      );

      expect(response).toEqual({
        id: "webhook-id"
      });
    });
  });

  describe("update", () => {
    test("api", async () => {
      mockAPI(
        "/organizations/org-id/webhooks/subscribe",
        {
          id: "webhook-id"
        },
        201,
        "post"
      );

      const response = await API_CLIENT.webhooks.update(
        {
          organizationId: "org-id"
        },
        {
          active: true,
          createdAt: "created-at",
          events: [],
          id: "webhook-id",
          key: "key",
          organizationId: "org-id",
          updatedAt: "updated-at",
          url: "url"
        }
      );

      expect(response).toEqual({
        id: "webhook-id"
      });
    });
  });

  describe("delete", () => {
    test("api", async () => {
      mockAPI(
        "/organizations/org-id/webhooks/webhook-id/unsubscribe",
        {},
        200,
        "delete"
      );

      const response = await API_CLIENT.webhooks.delete({
        organizationId: "org-id",
        webhookId: "webhook-id"
      });

      expect(response).toEqual({});
    });
  });

  describe("ping", () => {
    test("api", async () => {
      mockAPI(
        "/organizations/org-id/webhooks/webhook-id/ping",
        {},
        200,
        "post"
      );

      const response = await API_CLIENT.webhooks.ping({
        organizationId: "org-id",
        webhookId: "webhook-id"
      });

      expect(response).toEqual({});
    });
  });

  describe("deliveries", () => {
    test("api", async () => {
      mockAPI("/organizations/org-id/webhooks/webhook-id/deliveries", [
        {
          id: "delivery-id"
        }
      ]);

      const response = await API_CLIENT.webhooks.deliveries({
        organizationId: "org-id",
        webhookId: "webhook-id"
      });

      expect(response).toEqual([
        {
          id: "delivery-id"
        }
      ]);
    });
  });

  describe("redeliver", () => {
    test("api", async () => {
      mockAPI(
        "/organizations/org-id/webhooks/webhook-id/deliveries/delivery-id/redeliver",
        {},
        200,
        "post"
      );

      const response = await API_CLIENT.webhooks.redeliver({
        organizationId: "org-id",
        webhookId: "webhook-id",
        deliveryId: "delivery-id"
      });

      expect(response).toEqual({});
    });
  });

  describe("verify", () => {
    test("api", async () => {
      const payload = { foo: "bar" };
      const signingKey = "key";
      const expectedSignature = sha256.hmac(
        signingKey,
        JSON.stringify(payload)
      );
      const verified = await API_CLIENT.webhooks.verify(
        payload,
        expectedSignature,
        signingKey
      );
      expect(verified).toBe(true);
    });
  });
});
