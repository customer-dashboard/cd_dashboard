import { Page,ContextualSaveBar,Toast,Layout,SettingToggle,TextStyle} from '@shopify/polaris'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const ToggleFeature = () => {
const navigate = useNavigate();
const [setting, setSetting] = useState([]);  
const [active, setActive] = useState(false);
const toggleActive = useCallback(() => setActive((active) => !active), []);
const [save, setSave] = useState(false);  
const [activeToggle, setActiveToggle] = useState([]);
const changeHendle = (name,value,i) =>{
  let newFormValues = [...activeToggle];
  newFormValues[i]['value']=!value;
  if(name==="app_access_toggle")setting.app_access_toggle=newFormValues[i]['value'];
  else if(name==="updatebycustomer_toggle")setting.updatebycustomer_toggle=newFormValues[i]['value'];
  else if(name==="reorder_toggle")setting.reorder_toggle=newFormValues[i]['value'];
  setActiveToggle(newFormValues);
  setSave(true);
}



useEffect(() => {
  getSetting();
}, []);

const contextualSaveBarMarkup = save ? (
  <ContextualSaveBar
    message="Unsaved changes"
    saveAction={{
      onAction:()=>submit(),
    }}
    discardAction={{
      onAction:()=>setSave(false),
    }}
  />
) : null;

const getSetting = () => {
  axios.get(`/api/get-setting?shop=${Shop_name}`).then((response) => {
     
    if (response.data!=="") {
      var setresult = response.data;
      setSetting(setresult);
      setActiveToggle([
        {content:"Customers Dashboard Is", name:"app_access_toggle", value:setresult.app_access_toggle},
        {content:"Allows your customers to update their marketing preference from within their customer account profiles", name:"updatebycustomer_toggle", value:setresult.updatebycustomer_toggle},
        {content:"Reorder Is", name:"reorder_toggle", value:setresult.reorder_toggle}
      ])
    }
  })
}


const toastMarkup = active ? (
  <Toast content="Data Saved" onDismiss={toggleActive} />
) : null;


const submit =()=>{
  setting.custom_css=JSON.stringify(setting.custom_css);
  axios.post(`/api/set-setting?shop=${Shop_name}`,setting).then((response) => {
    if(response.status===200){
    setActive(true);
    setSave(false);
    getSetting();}
  })
}
  return (
    <Page title='Toggle Feature'
    breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}
    >
      {contextualSaveBarMarkup}
      {activeToggle.map((ele,index)=>(
          <Page key={index}>
        <Layout>
        <Layout.Section>
          <SettingToggle
            action={{
              content: ele.value ? 'Deactivate' : 'Activate',
              onAction:()=>changeHendle(ele.name, ele.value,index)
            }}
            enabled={ele.value}
          >{ele.content} <TextStyle variation="strong">{ele.value ? 'Activated' : 'Deactivated'}</TextStyle>.
          </SettingToggle>
        </Layout.Section>
      </Layout>
      </Page>
      ))}
       {toastMarkup}
    </Page>
  )
}
 
export default ToggleFeature