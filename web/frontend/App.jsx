import { BrowserRouter } from "react-router-dom";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import "./assets/style.css";
import Routes from "./Routes";
import { NavigationMenu } from "@shopify/app-bridge-react";
export default function App() {
const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
          <NavigationMenu
           navigationLinks={[
          {
              label: "Dashboard",
              destination:'/'
          },
          {
            label: "Profile Setup",
            destination:'/profilesetup'

          },
          {
            label: "Menu Builder",
            destination:'/menubuilder'

          },
          {
            label: "Translations",
            destination:'/translations'

          },
          {
            label: "Toggle Feature",
            destination:"/togglefeature"

          },
          {
            label: "Plan",
            destination:'/plan',
          },
          {
            label: "Setting",
            destination:'/setting'
          },
        ]}
            />
            <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
