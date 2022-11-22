import { Page,ContextualSaveBar,Toast,Layout,SettingToggle,TextStyle, Frame} from '@shopify/polaris'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAuthenticatedFetch } from "../hooks";
import SkeletonExample from './SkeletonExample';

export default function ToggleFeature(){
const navigate = useNavigate();
const [setting, setSetting] = useState({});  
  const fetch = useAuthenticatedFetch();
  const [progress, setProgress] = useState(true);
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

const getSetting = async () => {
  const getSetting = await fetch("/api/get-setting");
  const content = await getSetting.json();
  if (content!=="") {
    var setresult = content;
    setSetting(setresult);
    setActiveToggle([
      {content:"Customers Dashboard Is", name:"app_access_toggle", value:setresult.app_access_toggle},
      {content:"Allows your customers to update their marketing preference from within their customer account profiles", name:"updatebycustomer_toggle", value:setresult.updatebycustomer_toggle},
      {content:"Reorder Is", name:"reorder_toggle", value:setresult.reorder_toggle}
    ])
    setProgress(false);
  }
}


const toastMarkup = active ? (
  <Toast content="Data Saved" onDismiss={toggleActive} />
) : null;

 const submit = async () => {
  const response = await fetch('/api/set-setting', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(setting)
  });
const content = await response.json();
if (content.status === 200) {
  setActive(<Toast content={content.success} onDismiss={toggleActive} />);
  setSave(false);
  getSetting();
}
  }
  return (
<Frame>
  {
    progress?
    <SkeletonExample/>:
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
  }
</Frame>
  )
}
 