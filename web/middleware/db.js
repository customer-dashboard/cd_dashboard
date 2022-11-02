
import { DataType, Shopify } from "@shopify/shopify-api";
import mysql from 'mysql';
import {Customer,Asset,Page,Theme, RecurringApplicationCharge,Order, Metafield} from '@shopify/shopify-api/dist/rest-resources/2022-10/index.js';
const db = mysql.createConnection({
  // host: "pscadda.com",
  // user: "pscadda_customer", 
  // password: "pscadda_customer", 
  // database:"pscadda_customer_dashboard" 
  host: "localhost",
  user: "root", 
  password: "", 
  database:"customer_dashboard" 
});
export const Database = (app) => {
app.get("/api/get-data", async (req, res) => {
    const shop = req.query.shop;
    const query = req.query.query;
    db.query(`SELECT * FROM ${query} WHERE shop = ?`, shop, (err,result)=>{
       res.status(200).send(result); 
      }); 
  });
    app.get("/api/get-menu_builder", async (req, res) => {
    const shop = req.query.shop;
    db.query(`SELECT * FROM menu_builder_fields WHERE shop = ?`, shop, (err,result)=>{
      if(result.length > 0){
         res.status(200).send(result);
        }else{  
        db.query(`SELECT * FROM default_menu_builder_fields`, (err2,result2)=>{
         res.status(200).send(result2);
        }); 
        }
      }); 
  });

 
  app.get("/api/get-profile-fields", async (req, res) => {
    const shop = req.query.shop;
    db.query(`SELECT * FROM profile_fields WHERE shop = ?`, shop, (err,result)=>{
      if(result.length > 0){
         res.status(200).send(result);
        }else{  
        db.query(`SELECT * FROM profile_default_fields`, (err2,result2)=>{
         res.status(200).send(result2);
        }); 
        }
      }); 
  });

  app.get("/api/get-svg", async (req, res) => {
    db.query(`SELECT * FROM svg_file`, (err,result)=>{
      res.status(200).send(result);
     }); 
  });


  app.get("/api/get-profile-additional-fields", async (req, res) => {
    const shop = req.query.shop;
    db.query(`SELECT * FROM profile_additional_fields WHERE shop = ? ORDER BY orderby`, shop, 
    (err,result)=>{ 
       res.status(200).send(result); 
      })
      
      }); 

  app.get("/api/get-customers", async (req, res) => {
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const customers = await Customer.all({
      session: test_session,
      limit:250
    });
    const { q } = req.query;
    const keys = ["first_name", "last_name", "email"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key]?.includes(q))
      );
    };
    q ? res.json(search(customers).slice(0,20)) : res.json(customers);
  });

  //get single customer
  app.get("/api/get-customer/:id", async (req, res) => {
    const id = req.params.id;
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const customer =  await Customer.find({
      session:test_session,
      id:id,
      });
      res.status(200).send(customer); 
  });

  app.get("/api/get-orders/:id", async (req, res) => {
    const id = req.params.id;
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    try {
      const order = await Order.find({
        session: test_session,
        id:4879010631,
      });
        res.status(200).send(order); 
    } catch (error) {
      res.status(200).send(error); 
      
    }
  });


  app.get("/api/get-length", async (req, res) => {
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const CustomerCount = await Customer.count({
      session: test_session,
    });
    const OrderCount = await Order.count({
      session: test_session,
      financial_status: "any",
    });
      res.status(200).json({customer_count:CustomerCount.count,order_count:OrderCount.count}); 
  });

  app.get("/api/query-customers", async (req, res) => {
    const shop = req.query.shop;
    const fields = req.query.fields;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const CustomerCount = await Customer.search({
      session: test_session,
      fields:fields,
      limit:250
    });
      res.status(200).send(CustomerCount); 
  });

  app.get("/api/get-setting", async (req, res) => {
    const shop = req.query.shop;
    db.query(`SELECT * FROM cd_setting WHERE shop = ?`, shop, 
    (err,result)=>{ 
       res.status(200).send(result); 
      })
  });


  app.get("/api/get-profile-additional-metafields", async (req, res) => {
    const shop = req.query.shop;
    const id = req.query.id;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    try {
      const data = await Metafield.all({
        session: test_session,
        customer_id: id,
        key:"customer_dashboard"
      });
        res.status(200).send(data[0]);  
    } catch (error) {
      res.status(200).json({value:""});   
    }
  });

  app.get("/api/get-pages", async (req, res) => {
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const data = await Page.all({
      session: test_session,
    });
      res.status(200).send(data);  
  });




  app.get("/api/get-single-data/:id", async (req, res) => {
    const id = req.params.id;
    const shop = req.query.shop;
    const query = req.query.query;
    db.query(`SELECT * FROM ${query} WHERE shop = ? AND id = ?`, [shop,id], async(err,result)=>{
      if(err)res.send(err)
      else {
      res.status(200).send(result); 
      }
    })
  });


  app.get("/api/get-theme-id", async (req, res) => {
    const shop = req.query.shop;
    db.query(`SELECT theme_id FROM theme WHERE shop = ?`,shop, (err, result,)=>{
      if(err)res.send(err)
      else {
      res.status(200).send(result); 
      }
    })
  });


  app.post("/api/set-setting", async (req, res) => {
    const shop = req.query.shop;
    const body = JSON.stringify(req.body);
    try {
    db.query(`SELECT setting FROM cd_setting WHERE shop = ?`,shop, (err, result,)=>{
        if(result.length < 1){
          db.query(`INSERT INTO cd_setting (setting, shop) VALUES (?,?)`,[body,shop], (err,response)=>{
          if(err) {
          res.send(err); 
          } 
          res.status(200).send('Update'); 
          }); 
          }else{  
          db.query(`UPDATE cd_setting SET setting = '${body}'  WHERE shop = ?`,shop, (err,result)=>{
          if(err) {
            res.send(err)   } 
          res.status(200).send('Update'); 
          }); 
          }
    });    
      } catch (error) {
        res.status(200).send(error); 
      }
  });

 



// post customer data
app.post("/api/post-customer-data", async (req, res) => {
  const shop = req.query.shop;
  const data = req.body;
  var cd_accepts_marketing = ""
  if(data.cd_accepts_marketing){
    cd_accepts_marketing=data.cd_accepts_marketing;
  }else{
    cd_accepts_marketing="off";
  }
const test_session = await Shopify.Utils.loadOfflineSession(shop);
const metafield_data = {"metafield":{"namespace":"inventory","key":"customer_dashboard","value":"25","type":"string"}};
metafield_data.metafield.value=JSON.stringify(data);
const client = new Shopify.Clients.Rest(test_session.shop, test_session.accessToken);
const customer = new Customer({session: test_session});
customer.id = data.id;
customer.first_name = data.first_name;
customer.last_name = data.last_name;
customer.phone = data.phone;
customer.accepts_marketing  = cd_accepts_marketing;
try {
  await client.post({
    path: `customers/${data.id}/metafields`,
    data: metafield_data,
    type:DataType.JSON
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
const shop = req.query.shop;
const data = req.body;
const test_session = await Shopify.Utils.loadOfflineSession(shop);
const customer = new Customer({session: test_session});
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
    const shop = req.query.shop;
    const query = req.query.query;
    const fields = JSON.stringify(req.body);
    try {
    db.query(`SELECT shop FROM ${query} WHERE shop = ?`,shop, (err, result,)=>{
        if(result.length < 1){
          db.query(`INSERT INTO ${query} (fields, shop) VALUES (?,?)`,[fields,shop], (err,response)=>{
          if(err) {
          res.send(err); 
          } 
          res.status(200).send('Save'); 
          }); 
          }else{  
          db.query(`UPDATE ${query} SET fields = '${fields}'  WHERE shop = ?`,shop, (err,result)=>{
          if(err) {
          res.send(err)   } 
          res.status(200).send('Save'); 
          }); 
          }
    });    
      } catch (error) {
        res.status(200).send('error'); 
      }
  });

  app.post("/api/create-jsonfile", async (req,res) => {
    const shop = req.query.shop;
    const id = req.query.id;
    const data = JSON.stringify(req.body.value);
    const dir = `locales/${req.body.locale}-cd.json`;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const asset = new Asset({session: test_session});
    asset.theme_id = id;
    asset.key = dir;
    asset.value=data;
    try {
      await asset.save();
      res.status(200).send(asset); 
    } catch (error) {
      res.status(200).send('Error !'); 
    }
  });

  app.get("/api/get-main-theme", async (req, res) => {
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const asset = await Theme.all({
      session: test_session,
    });
    res.status(200).send(asset); 
  });

  app.get("/api/get-json", async (req, res) => {
    const shop = req.query.shop;
    const locale = req.query.locale;
    const theme_id = req.query.theme_id;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    try {
      const asset = await Asset.all({
        session: test_session,
        theme_id:theme_id,
        asset: {"key":`locales/${locale}-cd.json`}
      });
       const data = [];
        const array = JSON.parse(asset[0].value);
        var size = Object.keys(array).length;
        for (let index = 0; index<size; index++) {
          data.push(array[index]);
        } 
      res.status(200).send(data); 
     } catch (e) {
      db.query(`SELECT translation FROM translations `,(err,result)=>{
        res.status(200).send(JSON.parse(result[0].translation).en); 
       }); 
     }
  });
  


    app.post("/api/post-profile-additional-fields", async (req, res) => {
    const shop = req.query.shop;
    const fields = JSON.stringify(req.body);
        try {
          db.query(`SELECT orderby FROM profile_additional_fields WHERE shop = ? ORDER BY orderby`, shop, 
          (err,result)=>{
          db.query("INSERT INTO profile_additional_fields (fields, shop, orderby) VALUES (?,?,?)",[fields,shop,result.length], (err,response)=>{
            if(err) {
              res.send(err); 
            } 
            res.status(200).send('Save'); 
         }); 
})
        } catch (error) {
          res.status(200).json({"error":error}); 
        }
  });


  app.post("/menu-builder-custome-link", async (req, res) => {
    const shop = req.query.shop;
    const fields = req.body;
    const query = req.query.query;
    try {
        db.query(`INSERT INTO ${query} (label, value, shop, type) VALUES (?,?,?)`,[fields.label,fields.value,shop,fields.type], (err,response)=>{
          res.status(200).send(response); 
  });
        } catch (error) {
          res.status(200).json({"error":error}); 
        }
});

  app.post("/api/put-profile-additional-fields", async (req, res) => {
    const shop = req.query.shop;
    const fields = req.body;
  var result = fields.map((ele,index)=>{
      db.query(`UPDATE profile_additional_fields SET orderby = ${index}  WHERE id = ? AND shop = ?`,[ele.key,shop], (err,result)=>{
        return result;
      });  
  })
  res.status(200).send(result); 

  });




  app.post("/api/graphql-data-access", async (req, res) => {
    const fields =req.body;
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const client = new Shopify.Clients.Graphql(
      test_session.shop,
      test_session.accessToken
      );
      const data = await client.query({
        data: fields,
      });
        res.status(200).send(data); 
  });

  app.post("/api/get-billing", async (req, res) => {
    const fields =req.body;
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
   const data = await RecurringApplicationCharge.find({
      session: test_session,
      id: 455696195,
    });
        res.status(200).send(data); 
  });

  app.post("/api/graphql-billing", async (req, res) => {
    const fields =req.body;
    const shop = req.query.shop;
    const test_session = await Shopify.Utils.loadOfflineSession(shop);
    const client = new Shopify.Clients.Graphql(
      test_session.shop,
      test_session.accessToken
      );
      const data = await client.query({
        data: fields,
      });
      res.status(200).send(data); 
  });




  //Customer Dashboard app fronted operation

}