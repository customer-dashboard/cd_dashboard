import { Button, ButtonGroup, Card, FormLayout, Layout, Page, TextStyle, ContextualSaveBar,Toast, Link} from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {NavLink } from 'react-router-dom'
import { Feedback } from './components/FeedbackModel/Feedback'
import { Toggle } from './components/Toggle'
  
const Home = (props)=>{
  const {count,billing }=props;
  const [setting, setSetting] = useState([]);  
const [save, setSave] = useState(false);  
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
    const cardData = [
        {title:"Customers", content:<NavLink to="/components/customers/customers">View Customers</NavLink>,value:count.customer_count},
        {title:"Order", content:<Link url={`https://${Shop_name}/admin/orders`} external>All Orders</Link> ,value:count.order_count},
        {title:"Current Plan",content:"", value:billing&&billing.status === 'active'?billing.name:"Basic-Free"},
    ]
    const dataCard = [
        {heading:"Translations",value:"Add translations to use Customer Dashboard in any language.",content:"Manage Translations",link:"/components/setting/translations"},
        {heading:"Plan",value:"Basic-Free",content:"Upgrade Plan",link:"/components/billing/plan"},
        {heading:"Need Help",value:"",content:"Go To Support",link:""},
        {heading:"What Do You Think About This App",value:"",content:"Give Us Feedback",link:""},
        {heading:"Don't Have What You Need",value:"",content:"Request A Feature",link:""},
    ]

useEffect(() => {
  getSetting();
  console.log(billing);
}, [])

const toastMarkup = active ? (
  <Toast content="Data Saved" onDismiss={toggleActive} />
) : null;

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

    const hendlChange = (e) =>{
    setting.app_access_toggle=e.app_access_toggle;
    setSave(true);
    }



    const getSetting = () => {
      axios.get(`/api/get-setting?shop=${Shop_name}`).then((response) => {
        if (response.data!=="") {
          setSetting(response.data);
        }
  })
    }
    
    const submit =()=>{
      axios.post(`/api/set-setting?shop=${Shop_name}`,setting).then((response) => {
      if(response.status===200){
        setActive(true);
        setSave(false);
        getSetting();
      }
      })
    }
    
  return (
<>
<Page title='Dashboard'>
  {contextualSaveBarMarkup}
  <Layout>
    {cardData.map((ele,index)=>(
          <Layout.Section key={index} oneThird>
          <Card title={ele.title} actions={ele.content?[{content:ele.content}]:""}>
            <Card.Section>
              <TextStyle variation="subdued">{ele.value}</TextStyle>
            </Card.Section>
          </Card>
        </Layout.Section>
    ))}
  </Layout> 
</Page>
<Toggle content="Customers Dashboard Is" name="app_access_toggle" value={setting.app_access_toggle} hendleChange={hendlChange}/>
  <Page title="Setting">
    <Layout>
        {
            dataCard.map((ele,index)=>(
              <Layout.AnnotatedSection
              title={ele.heading} key={index}>
              <Card sectioned>
                <FormLayout>
                  {ele.value?<p>{ele.value}</p>:""}
                  <ButtonGroup>
                  {ele.link?<NavLink className='link' to={ele.link}><Button>{ele.content?ele.content:""}</Button></NavLink>:<Feedback value={ele.content}/>}
              </ButtonGroup>
                </FormLayout>
              </Card>
            </Layout.AnnotatedSection>
          ))
        }
        {toastMarkup}
    </Layout>
  </Page>
  </>
  )
}

export default Home