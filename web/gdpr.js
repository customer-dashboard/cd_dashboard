import { Shopify } from "@shopify/shopify-api";

export function setupGDPRWebHooks(path) {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_DATA_REQUEST", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
    },
  });

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_REDACT", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
    },
  });

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  Shopify.Webhooks.Registry.addHandler("SHOP_REDACT", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
    },
  });
}

export const shopifyWebhook_CUSTOMERS_DATA_REQUEST = (app) => {
  app.post('/api/webhooks/customers_data_request', async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log({status:200});
    } catch (error) {
      console.log(error.message);
    }
  });
}

export const shopifyWebhook_CUSTOMERS_REDACT = (app) => {
  app.post('/api/webhooks/customers_redact', async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log({status:200});
    } catch (error) {
      console.log(error.message);
    }
  });
}

export const shopifyWebhook_SHOP_REDACT = (app) => {
  app.post('/api/webhooks/shop_redact', async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log({status:200});
    } catch (error) {
      console.log(error.message);
    }
  });
}