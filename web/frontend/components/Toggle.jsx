import { Layout, Page, SettingToggle, TextStyle } from '@shopify/polaris';
import { useEffect } from 'react';
import { useState } from 'react'
export default function Toggle(props){
  const { content, name, value, hendleChange } = props;
  const [active, setActive] = useState();
  useEffect(() => {
  setActive(value)
  }, [value])
  
  const handleToggle = () => {
    setActive(!active);
    hendleChange({ [name]: !active });
  }
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <SettingToggle
            action={{
              content: active ? 'Deactivate' : 'Activate',
              onAction: handleToggle,
            }}
            enabled={active}
          >{content} <TextStyle variation="strong">{active ? 'Activated' : 'Deactivated'}</TextStyle>.
          </SettingToggle>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
