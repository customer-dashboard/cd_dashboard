import { Layout, Page, SettingToggle, TextStyle } from '@shopify/polaris';
import axios from 'axios';
import {useEffect, useState } from 'react'

export const Toggle=({content,table})=>{
    const [active, setActive] = useState(false); 

    useEffect(() => {
      getToggleValue();
    }, [])


   const handleToggle =() =>{
    if(table!==""){
      setActive(!active);
      const data = {active:!active}
      axios.post(`/api/toggle-value?shop=${Shop_name}&query=${table}`,data).then((response) => {
      console.log(response);
      });
    }
    }

    const getToggleValue = ()=>{
    if(table!==""){
      axios.get(`/api/get-data?shop=${Shop_name}&query=${table}`).then((response) => {
        setActive(response.data[0].status);
      });
    }
    }
  
    const contentStatus = active ? 'Deactivate' : 'Activate'
    const textStatus = active ? 'Activated' : 'Deactivated';
  
    return (
    <Page>
        <Layout>
        <Layout.Section>
        <SettingToggle
        action={{
          content: contentStatus, 
          onAction: handleToggle,
        }}
        enabled={active}
      >{content} <TextStyle variation="strong">{textStatus}</TextStyle>.
      </SettingToggle>
        </Layout.Section>
    </Layout>
    </Page>
    );
  }
