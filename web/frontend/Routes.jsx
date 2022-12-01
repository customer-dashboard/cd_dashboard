import { useEffect, useState } from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import svg from "../frontend/components/metafields/Svg_icon";
import menu from "../frontend/components/metafields/menu";
import profile from "../frontend/components/metafields/profile";
import setting_json from "../frontend/components/metafields/setting";
import localjson from "../frontend/components/metafields/translation";
import { useAuthenticatedFetch } from "./hooks";
import Alert from "./components/Alert";
export default function Routes(props) {
  const [shop, setShop] = useState("");
  const fetch = useAuthenticatedFetch();
  const [billing, setBilling] = useState({});
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    getMenuBuilder();
    getProfileData();
    getSetting();
    getJson();
    getShop();
    getSvgIcon();
    getCustomers();
    getPaymentList();
  }, [])
  
  const getPaymentList = async() =>{
    const response = await fetch("/api/get-billing");
    const content = await response.json();
    if(content.status===200)setBilling(content.data);
  }

  const InstallMetafields = async (url,data) => {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
   }
   const getCustomers = async () => {
    const getSetting = await fetch("/api/get-length");
    const content = await getSetting.json();
    if(content.status===200)setCustomers(content.data);
  }

    const getMenuBuilder = async () => {
      const getSetting = await fetch("/api/get-menu_builder");
      const content = await getSetting.json();
      if (content.data.length<1) await InstallMetafields('/api/post-reorder-fields?query=menu_builder_fields',menu);
    }

    const getShop = async () => {
      const get_shop = await fetch("/api/get-shop");
      const content = await get_shop.json();
      setShop(content.shop);
    }
  
    const getProfileData = async() => {
      const getSetting = await fetch("/api/get-profile-fields");
      const content = await getSetting.json();
      if (content.data.length<1) await InstallMetafields('/api/post-reorder-fields?query=profile_fields',profile);
    }
  
    const getSetting = async () => {
      const getSetting = await fetch("/api/get-setting");
      const content = await getSetting.json();
      if (content.data.length<1)await InstallMetafields('/api/set-setting',setting_json); 
    }

    const getJson = async() => {
      const getSetting = await fetch(`/api/get-json?locale=en`);
      const content = await getSetting.json();
      if (content.data.length<1){
        const data = {value:localjson,locale:"en"}
        await InstallMetafields('/api/create-translations',data);
      }
  }

  const getSvgIcon = async () => {
    const getSetting = await fetch("/api/get-svg");
    const content = await getSetting.json();
    if (content.data.length<1)await InstallMetafields('/api/set-svg',svg);
  }
  const { pages } = props;
  const routes = useRoutes(pages);
  const routeComponents = routes.map(({ path, component: Component }) => (
    <Route key={path} path={path} element={<Component shop={shop} billing={billing} count={customers} />} />
  ));
  const NotFound = routes.find(({ path }) => path === "/notFound").component;

  return (
   <>
    <Alert value={customers?.customer_count} billing={billing}/>
    <ReactRouterRoutes>
      {routeComponents}
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
   </>
  );
}

function useRoutes(pages) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace("./pages", "")
        .replace(/\.(t|j)sx?$/, "")
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, "/")
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => route.component);

  return routes;
}
