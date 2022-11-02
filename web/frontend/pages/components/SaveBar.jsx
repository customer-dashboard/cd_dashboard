import { useState } from 'react'
import {ContextualSaveBar} from "@shopify/polaris";
export const SaveBar = (props) => {
    const [save, setSave] = useState(true);  
    const contextualSaveBarMarkup = save ? (
      <ContextualSaveBar
        message="Unsaved changes"
        saveAction={{
        }}
        discardAction={{
        }}
      />
    ) : null;
  return contextualSaveBarMarkup;
}
