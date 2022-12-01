
import { DataType, Shopify } from "@shopify/shopify-api";
import { Customer, Page, Theme, RecurringApplicationCharge, Order, Metafield } from '@shopify/shopify-api/dist/rest-resources/2022-10/index.js';
import ensureBilling from "../helpers/ensure-billing.js";
import returnTopLevelRedirection from "../helpers/return-top-level-redirection.js";
export const Database = (app) => {
  app.post("/api/graphql-billing", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const billing = req.body;
    if (billing.required) {
      const [hasPayment, confirmationUrl] = await ensureBilling(
        session,
        billing
      );
      if (!hasPayment) {
        returnTopLevelRedirection(req, res, confirmationUrl);
        return;
      }
      res.status(200).send(confirmationUrl);
    }
  });

  app.get("/api/get-billing", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await RecurringApplicationCharge.find({
        session: session,
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  app.get("/api/get-billing-frontend", async (req, res) => {
    const { shop} = req.query;
    const session = await Shopify.Utils.loadOfflineSession(shop);
    let status = 200;
    let error = null;
    let data = [];
    try {
      const billing = await RecurringApplicationCharge.find({
        session: session,
      });
      const CustomerCount = await Customer.count({
        session: session,
      });
      data = { customer_count: CustomerCount.count, billing: billing }
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  app.get("/api/get-shop", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      res.status(200).send(session);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/api/get-setting", async (req, res) => {
    const { shop } = req.query;
    var session=[];
    shop?
    session = await Shopify.Utils.loadOfflineSession(shop):
    session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await Metafield.all({
        session: session,
        key: "setting"
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.get("/api/get-length", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      const CustomerCount = await Customer.count({
        session: session,
      });
      const OrderCount = await Order.count({
        session: session,
        financial_status: "any",
      });
      data = { customer_count: CustomerCount.count, order_count: OrderCount.count }
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.get("/api/get-menu_builder", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await Metafield.all({
        session: session,
        key: "menu_builder_fields"
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });
  app.get("/api/get-profile-fields", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await Metafield.all({
        session: session,
        key: "profile_fields"
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  app.get("/api/get-customers", async (req, res) => {
    const { page, search } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    let status = 200;
    let error = null;
    let data = [];
    try {
      async function customerFunction(page) {
        return await client.get({
          path: 'customers',
          query: {
            fields: "id,first_name,email,email_marketing_consent,default_address,orders_count,total_spent",
            page_info: page
          }
        });
      }
      const customers = await customerFunction(page);

      if (search) {
        var page_info = "";
        const array = [];
        for (let index = 0; page_info !== undefined; index++) {
          var searchCustomer = await customerFunction(page_info);
          page_info = searchCustomer.pageInfo.nextPage?.query.page_info;
          array.push(searchCustomer.body.customers)
        }
        const keys = ["first_name", "email"];
        const searchFilter = (data) => {
          return data.filter((item) =>
            keys.some((key) => item[key]?.includes(search))
          );
        };
        data = { body: { customers: searchFilter(array.flat(1)) } }
      } else {
        data = customers;
      }
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  app.get("/api/get-svg", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await Metafield.all({
        session: session,
        key: "svg_icon"
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.get("/api/get-profile-additional-metafields", async (req, res) => {
    const id = req.query.id;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await Metafield.all({
        session: session,
        customer_id: id,
        key: "additional_data"
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  app.get("/api/get-pages", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      data = await Page.all({
        session: session,
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });



  app.post("/api/set-setting", async (req, res) => {
    const { shop } = req.query;
    var session = [];
    const body = JSON.stringify(req.body);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "setting", "value": "25", "type": "json" } };
    metafield_data.metafield.value = body;
    shop?
    session = await Shopify.Utils.loadOfflineSession(shop):
    session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
      const client = new Shopify.Clients.Rest(session?.shop, session?.accessToken);
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      data = "Setting Saved";
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.post("/api/delete-cd-metafields", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    let status = 200;
    let error = null;
    let data = [];
    try {
     const resbody = await Metafield.all({
        session: session,
        namespace: "customer_dashboard"
      });
      for (let index = 0; index < resbody.length; index++) {
        const id = resbody[index].id;
        await Metafield.delete({
          session: session,
          id: id,
        });
        data="Delete Metafields";
      }
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.post("/api/set-svg", async (req, res) => {

    const body = JSON.stringify(req.body);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "svg_icon", "value": "25", "type": "json" } };
    metafield_data.metafield.value = body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    let status = 200;
    let error = null;
    let data = [];
    try {
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      data="Svg Icon Saved";
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });
  app.post("/api/create-translations", async (req, res) => {
    const locale = req.body.locale;
    const translations = JSON.stringify(req.body.value);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "translations_" + locale, "value": "25", "type": "json" } };
    metafield_data.metafield.value = translations;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    let status = 200;
    let error = null;
    let data = [];
    try {
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      data="Translations Saved";
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  // post customer data
  app.post("/api/post-customer-data", async (req, res) => {
    let status = 200;
    let error = null;
    let data = [];
    const { shop } = req.query;
    const customer_data = req.body;
    var cd_accepts_marketing = ""
    if (customer_data.cd_accepts_marketing) {
      cd_accepts_marketing = customer_data.cd_accepts_marketing;
    } else {
      cd_accepts_marketing = "off";
    }
    const session = await Shopify.Utils.loadOfflineSession(shop);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "additional_data", "value": "25", "type": "json" } };
    metafield_data.metafield.value = JSON.stringify(customer_data);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const customer = new Customer({ session: session });
    customer.id = customer_data.id;
    customer.first_name = customer_data.first_name;
    customer.last_name = customer_data.last_name;
    customer.phone = customer_data.phone;
    customer.accepts_marketing = cd_accepts_marketing;
    try {
      await client.post({
        path: `customers/${customer_data.id}/metafields`,
        data: metafield_data,
        type: DataType.JSON
      });

      await customer.save({
        update: true,
      });
      data="Data is update";
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.post("/api/post-customer-password", async (req, res) => {
    let status = 200;
    let error = null;
    let data = [];
    const { shop } = req.query;
    const customer_password = req.body;
    const session = await Shopify.Utils.loadOfflineSession(shop);
    const customer = new Customer({ session: session });
    customer.id = customer_password.id;
    customer.password = customer_password.password;
    customer.password_confirmation = customer_password.passwordConfirmation;
    customer.send_email_welcome = false;
    try {
     data = await customer.save({
        update: true,
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

  // post query   

  app.post("/api/post-reorder-fields", async (req, res) => {
    const query = req.query.query;
    const fields = JSON.stringify(req.body);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": query, "value": "25", "type": "json" } };
    metafield_data.metafield.value = fields;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    let status = 200;
    let error = null;
    let data = [];
    try {
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      data=query+" Save";
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });



  app.get("/api/get-json", async (req, res) => {
    let status = 200;
    let error = null;
    let data = [];
    const locale = req.query.locale;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      data = await Metafield.all({
        session: session,
        key: "translations_" + locale
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });


  app.post("/api/graphql-data-access", async (req, res) => {
    let status = 200;
    let error = null;
    let data = [];
    const fields = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Graphql(session?.shop, session?.accessToken);
    try {
      data = await client.query({
        data: fields,
      });
    } catch (error) {
      status = 500;
      error = error.message;
    }
    res.status(status).send({ status, data, error });
  });

}