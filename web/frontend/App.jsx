import { BrowserRouter } from "react-router-dom";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import FrameHome from "./Frame";
import "./assets/style.css";
export default function App() {
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
