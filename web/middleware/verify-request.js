import { Shopify } from "@shopify/shopify-api";
import returnTopLevelRedirection from "../helpers/return-top-level-redirection.js"; 
export default function verifyRequest(app) {
  return async (req, res, next) => {
    const session = await Shopify.Utils.loadOfflineSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    let shop = req.query.shop;

    if (session && shop && session.shop !== shop) {
      // The current request is for a different shop. Redirect gracefully.
      return res.redirect(`/api/auth?shop=${shop}`);
    }

    const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/);
    if (bearerPresent) {
      if (!shop) {
        if (session) {
          shop = session.shop;
        } else if (Shopify.Context.IS_EMBEDDED_APP) {
          if (bearerPresent) {
            const payload = Shopify.Utils.decodeSessionToken(bearerPresent[1]);
            shop = payload.dest.replace("https://", "");
          }
        }
      }
    }

    returnTopLevelRedirection(req, res, `/api/auth?shop=${shop}`);
  };
}
