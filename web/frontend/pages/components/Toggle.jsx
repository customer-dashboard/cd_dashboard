import { Layout, Page, SettingToggle, TextStyle } from '@shopify/polaris';
import { useState } from 'react'

export default function Toggle({ content, name, value, hendleChange }){
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(true);
    setActive(!active);
    hendleChange({ [name]: !active });
  }
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <SettingToggle
            action={{
              content: toggle?active ? 'Deactivate' : 'Activate':value ? 'Deactivate' : 'Activate',
              onAction: handleToggle,
            }}
            enabled={toggle?active:value}
          >{content} <TextStyle variation="strong">{toggle?active ? 'Activated' : 'Deactivated':value ? 'Activated' : 'Deactivated'}</TextStyle>.
          </SettingToggle>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
