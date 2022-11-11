import { BrowserRouter } from "react-router-dom";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import FrameHome from "./Frame";
import "./assets/style.css";
import svg from "./metafields/Svg_icon";
import menu from "./metafields/menu";
import profile from "./metafields/profile";
import setting_json from "./metafields/setting";
import localjson from "./metafields/translation";
import axios from "axios";
import { useEffect } from "react";
export default function App() {

useEffect(() => {
  getMenuBuilder();
  getProfileData();
  getSetting();
  getJson();
  getSvgIcon();
}, [])


  const getMenuBuilder = () => {
    axios.get(`/api/get-menu_builder?shop=${Shop_name}`).then((response) => {
      if (response.data==="")axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`, menu);
    });
  }

  const getProfileData = () => {
    axios.get(`/api/get-profile-fields?shop=${Shop_name}`).then((response) => {
      if (response.data==="")axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=profile_fields`, profile);
    });
  }

  const getSetting = () => {
    axios.get(`/api/get-setting?shop=${Shop_name}`).then((response) => {
      if (response.data==="")axios.post(`/api/set-setting?shop=${Shop_name}`,setting_json);
})
  }

  const getJson = () => {
    axios.get(`/api/get-json?shop=${Shop_name}&locale=en`).then((response) => {
      if(response.data===""){const data = {value:localjson,locale:"en"}
        axios.post(`/api/create-translations?shop=${Shop_name}`,data);
      }
    })
}

const getSvgIcon = () => {
  axios.get(`/api/get-svg?shop=${Shop_name}`).then((response) => {
    if (response.data==="")axios.post(`/api/set-svg?shop=${Shop_name}`,svg);
  })
}
 
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
           <FrameHome/>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
