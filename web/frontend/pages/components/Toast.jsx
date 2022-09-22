import { Toast, Frame, Button } from "@shopify/polaris";
import { useState, useCallback } from "react";

export function ToastExample() {
  const [active, setActive] = useState(true);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Message sent" onDismiss={toggleActive} />
  ) : null;

 
 return toastMarkup;
}

