import { ContextualSaveBar, Frame } from '@shopify/polaris'
import { useState } from 'react'

export const Contextual = ({value}) => {
  const [isDirty, setIsDirty] = useState(value);
    const contextualSaveBarMarkup = isDirty ? (
        <ContextualSaveBar
        fullWidth
        message="Unsaved changes"
        saveAction={{
          onAction: () =>setIsDirty(false),
          loading: false,
          disabled: false,
        }}
        discardAction={{
          onAction: () => setIsDirty(false),
        }}
      />
      ) : null;
  return (
<div style={{height: '10px'}}>
  <Frame
    logo={{
      width: 124,
      contextualSaveBarSource:
        'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
    }}
  >
     {contextualSaveBarMarkup}
  </Frame>
</div>
  )
}
