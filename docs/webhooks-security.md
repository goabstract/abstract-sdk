---
id: webhooks-security
title: Webhooks Security
---

After configuring a new webhook and a server to listen for deliveries, it's a good idea to secure that server against unwanted requests. Specifically, requests should be limited to those that originate from Abstract. While many different methods exist for restricting traffic from unwanted domains, Abstract uses delivery signatures as its primary means of verification. This means that a signature can optionally be computed for each delivery request sent to a webhook's configured endpoint. This signature can then be used to easily verify that a delivery was sent by Abstract.

## Configuring a signing key

During the creation process for a webhook, an optional **signing key** can be configured. If a value is provided for this field, signature verification will be enabled, and the signing key will be used as a secret when calculating a signature for each delivery payload.

> Signing keys should be treated like passwords and should never be committed to version control.

See [Creating a webhook](/docs/webhooks#creating-a-webhook) for more information on creating a webhook with a signing key.

## Verifying a delivery

When a webhook has a signing key configured during setup, delivery requests to its endpoint will include an `Abstract-Webhooks-Signature` request header. The value of this header is then compared to the signature of the received payload together with the signing key.

1. Sign the delivery payload using the signing key.
1. Compare this value to the `Abstract-Webhooks-Signature` value.

### Using the SDK

The recommended way to verify webhook deliveries is to use the official [JavaScript SDK](/docs).

The SDK exposes a [`webhooks.verify` method](/docs/abstract-api#verify-a-webhook-delivery) specifically intended to verify webhook deliveries. The method accepts a delivery payload, the `Abstract-Webhooks-Signature` header, and the webhook's configured signing key, and returns a `Promise` that resolves to a `boolean` indicating verification status.

```js
const abstract = require("abstract-sdk");
const bodyParser = require("body-parser");
const express = require("express");

const client = new abstract.Client();
const app = express();

app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const payload = req.body;
  const expectedSignature = req.header("Abstract-Webhooks-Signature");
  const signingKey = process.env.WEBHOOK_SIGNING_KEY;
  const verified = await client.webhooks.verify(payload, expectedSignature, signingKey);

  if (!verified) {
    res.status(500).send("Webhook payload could not be verified.");
    return;
  }

  // Webhook verified, do something with payload data...
});

app.listen(1337);
```

### Manually

While using the official SDK is the recommended way to verify webhook deliveries, manual verification can be used instead.

A delivery's signature is created by generating a hash-based message authentication code ([HMAC](https://en.wikipedia.org/wiki/HMAC)) of the request body using the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) digest algorithm.

1. **Sign the delivery payload**
    
    Compute an HMAC using SHA-256 using the delivery request body as the message and the webhook's configured signing key as the key.

1. **Compare to `Abstract-Webhooks-Signature`**
    
    Compare the calculated signature to the signature provided in the header. If the two signatures are equal, you can be sure that the request is verified and was sent by Abstract.

```js
const bodyParser = require("body-parser");
const express = require("express");
const sha256 = require("js-sha256");

const app = express();

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  const payload = req.body;
  const expectedSignature = req.header("Abstract-Webhooks-Signature");
  const signingKey = process.env.WEBHOOK_SIGNING_KEY;
  const signature = sha256.hmac(signingKey, JSON.stringify(payload));
  
  if (signature !== expectedSignature) {
    res.status(500).send("Webhook payload could not be verified.");
    return;
  }

  // Webhook verified, do something with payload data...
});

app.listen(1337);
```
