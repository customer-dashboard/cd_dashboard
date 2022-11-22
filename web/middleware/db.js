
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
    try {
      const data = await RecurringApplicationCharge.find({
        session: session,
        status: "active"
      });
      res.status(200).send(data);
    } catch (error) {
    }
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
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const data = await Metafield.all({
        session: session,
        key: "setting"
      });
      res.status(200).send(JSON.parse(data[0].value));
    } catch (error) {
      res.status(200).send("");
    }
  });


  app.get("/api/get-length", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const CustomerCount = await Customer.count({
      session: session,
    });
    const OrderCount = await Order.count({
      session: session,
      financial_status: "any",
    });
    res.status(200).json({ customer_count: CustomerCount.count, order_count: OrderCount.count });
  });


  app.get("/api/get-menu_builder", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const data = await Metafield.all({
        session: session,
        key: "menu_builder_fields"
      });
      res.status(200).send(data[0]);
    } catch (error) {
      res.status(200).send("");
    }
  });
  app.get("/api/get-profile-fields", async (req, res) => {

    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const data = await Metafield.all({
        session: session,
        key: "profile_fields"
      });
      res.status(200).send(data[0]);
    } catch (error) {
      res.status(200).send("");
    }
  });
  app.get("/api/get-customers", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const customers = await Customer.all({
      session: session,
    });
    const { q } = req.query;
    const keys = ["first_name", "last_name", "email"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key]?.includes(q))
      );
    };
    q ? res.json(search(customers).slice(0, 20)) : res.json(customers);
  });

  //get single customer
  app.get("/api/get-customer/:id", async (req, res) => {
    const id = req.params.id;

    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const customer = await Customer.find({
      session: session,
      id: id,
    });
    res.status(200).send(customer);
  });

  app.get("/api/get-orders/:id", async (req, res) => {
    const id = req.params.id;

    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const order = await Order.find({
        session: session,
        id: 4879010631,
      });
      res.status(200).send(order);
    } catch (error) {
      res.status(200).send(error);

    }
  });


  app.get("/api/query-customers", async (req, res) => {

    const fields = req.query.fields;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const CustomerCount = await Customer.search({
      session: session,
      fields: fields,
      limit: 250
    });
    res.status(200).send(CustomerCount);
  });


  app.get("/api/get-svg", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const data = await Metafield.all({
        session: session,
        key: "svg_icon"
      });
      res.status(200).send(JSON.parse(data[0].value));
    } catch (error) {
      res.status(200).send("");
    }
  });


  app.get("/api/get-profile-additional-metafields", async (req, res) => {
    const id = req.query.id;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const data = await Metafield.all({
        session: session,
        customer_id: id,
        key: "additional_data"
      });
      res.status(200).send(data[0]);
    } catch (error) {
      res.status(200).send("");
    }
  });

  app.get("/api/get-pages", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const data = await Page.all({
      session: session,
    });
    res.status(200).send(data);
  });



  app.post("/api/set-setting", async (req, res) => {
    const body = JSON.stringify(req.body);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "setting", "value": "25", "type": "json" } };
    metafield_data.metafield.value = body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const client = new Shopify.Clients.Rest(session?.shop, session?.accessToken);
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      res.status(200).send({ status: 200, success: "Data Saved" });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/api/set-svg", async (req, res) => {

    const body = JSON.stringify(req.body);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "svg_icon", "value": "25", "type": "json" } };
    metafield_data.metafield.value = body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    try {
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      res.send("Data Saved");
    } catch (error) {
      res.status(200).send(error);
    }
  });
  app.post("/api/create-translations", async (req, res) => {

    const locale = req.body.locale;
    const data = JSON.stringify(req.body.value);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "translations_" + locale, "value": "25", "type": "json" } };
    metafield_data.metafield.value = data;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    try {
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      res.status(500).send({status:200, success:"Data Saved"});
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // post customer data
  app.post("/api/post-customer-data", async (req, res) => {

    const data = req.body;
    var cd_accepts_marketing = ""
    if (data.cd_accepts_marketing) {
      cd_accepts_marketing = data.cd_accepts_marketing;
    } else {
      cd_accepts_marketing = "off";
    }
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": "additional_data", "value": "25", "type": "json" } };
    metafield_data.metafield.value = JSON.stringify(data);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const customer = new Customer({ session: session });
    customer.id = data.id;
    customer.first_name = data.first_name;
    customer.last_name = data.last_name;
    customer.phone = data.phone;
    customer.accepts_marketing = cd_accepts_marketing;
    try {
      await client.post({
        path: `customers/${data.id}/metafields`,
        data: metafield_data,
        type: DataType.JSON
      });

      await customer.save({
        update: true,
      });
      res.send("Data is update");
    } catch (error) {
      res.send("Error !");
    }
  });


  app.post("/api/post-customer-password", async (req, res) => {

    const data = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const customer = new Customer({ session: session });
    customer.id = data.id;
    customer.password = data.password;
    customer.password_confirmation = data.passwordConfirmation;
    customer.send_email_welcome = false;
    try {
      await customer.save({
        update: true,
      });
      res.send(customer);
    } catch (error) {
      res.send('Error !');

    }
  });

  // post query   

  app.post("/api/post-reorder-fields", async (req, res) => {

    const query = req.query.query;
    const fields = JSON.stringify(req.body);
    const metafield_data = { "metafield": { "namespace": "customer_dashboard", "key": query, "value": "25", "type": "json" } };
    metafield_data.metafield.value = fields;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    try {
      await client.post({
        path: 'metafields',
        data: metafield_data,
        type: DataType.JSON
      });
      res.send("Save");
    } catch (error) {
      res.status(200).send("");
    }
  });



  app.get("/api/get-main-theme", async (req, res) => {

    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const asset = await Theme.all({
      session: session,
    });
    res.status(200).send(asset);
  });

  app.get("/api/get-json", async (req, res) => {
    const locale = req.query.locale;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    try {
      const data = await Metafield.all({
        session: session,
        key: "translations_"+locale
      });
      res.status(200).send(data[0]);
    } catch (error) {
      res.status(500).send(error);
    }
  });


  app.post("/api/graphql-data-access", async (req, res) => {
    const fields = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    const client = new Shopify.Clients.Graphql(session?.shop, session?.accessToken);
    try {
      const data = await client.query({
        data: fields,
      });
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });





  //Customer Dashboard app fronted operation

}