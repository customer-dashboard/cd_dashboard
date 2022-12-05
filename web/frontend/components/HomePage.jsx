import { Button, ButtonGroup, Card, FormLayout, Layout, Page, TextStyle, ContextualSaveBar, Toast, Link, Frame, Spinner } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Feedback from './FeedbackModel/Feedback'
import Toggle from './Toggle'
import SkeletonExample from './SkeletonExample'
import { useAuthenticatedFetch } from "../hooks";
export default function HomePage(props) {
  const {shop,billing, count} = props;
  const [progress, setProgress] = useState(true)
  const [setting, setSetting] = useState({});
  const fetch = useAuthenticatedFetch();
const [loading, setLoading] = useState(false);
const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const cardData = [
    { title: "Customers", content: <NavLink to="/customers">View Customers</NavLink>, value: count?.customer_count },
    { title: "Order", content: <Link url={`https://${shop}/admin/orders`} external>All Orders</Link>, value: count?.order_count },
    { title: "Current Plan", content: "", value: billing && billing.status === 'active' ? billing.name : "Basic-Free" },
  ]
  const dataCard = [
    { heading: "Translations", content: <NavLink className="link" to="/translations"><Button >Manage Translations</Button></NavLink>, value: "Add translations to use Customer Dashboard in any language." },
    { heading: "Plan", content: <NavLink className="link" to="/plan"><Button>Upgrade Plan</Button></NavLink>, value: "Basic-Free" },
    { heading: "Need Help", content: <Link removeUnderline url="https://customerdashboard.pro/documentation" external><Button>Go To Support</Button></Link>, value:"" },
    { heading: "What Do You Think About This App", content: <Link removeUnderline className="link" url="https://customerdashboard.pro/feedback" external><Button>Give Us Feedback</Button></Link>, value: ""},
    { heading: "Don't Have What You Need", content:<Feedback value="Request A Feature" shop={shop} />, value:"" },
  ]
  useEffect(() => {
    getSetting();
  }, [])

  const contextualSaveBarMarkup = save ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
        loading:loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null,
        onAction: () => submit(),
      }}
      discardAction={{
        onAction: () => setSave(false),
      }}
    />
  ) : null;

  const hendlChange = (e) => {
    setting.app_access_toggle = e.app_access_toggle;
    setSave(true);
  }

  const getSetting = async () => {
    const getSetting = await fetch("/api/get-setting");
    const content = await getSetting.json();
    if(content.status===200){
      setSetting(JSON.parse(content.data[0].value));
      setProgress(false);
    }
  }


  const DeleteMetafields= async()=>{
    if(confirm("are you sure delete all metafields of Customers Dashbaord Pro app")===true){
      const response = await fetch('/api/delete-cd-metafields', {
        method: 'POST',
      });
    const content = await response.json();
    console.log(content);
    }
  }

  const submit = async () => {
  setLoading(true);
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
  setActive(<Toast content={content.data} onDismiss={toggleActive} />);
}
else if(content.status===500){
  setActive(<Toast content={content.error} error onDismiss={toggleActive} />);
}
setLoading(false);
setSave(false);
getSetting();
  }

  return (
    <Frame>
      {
        progress ?
          <SkeletonExample /> :
          <div style={{paddingBottom:"100px"}}>
            <Page title='Dashboard'>
              {contextualSaveBarMarkup}
              <button style={{display:"none"}} onClick={DeleteMetafields}>Delete Metafields</button>
              <Layout>
                {cardData.map((ele, index) => (
                  <Layout.Section key={index} oneThird>
                    <Card title={ele.title} actions={ele.content ? [{ content: ele.content }] : ""}>
                      <Card.Section>
                        <TextStyle variation="subdued">{ele.value}</TextStyle>
                      </Card.Section>
                    </Card>
                  </Layout.Section>
                ))}
              </Layout>
            </Page>
            <Toggle content="Customers Dashboard Is" name="app_access_toggle" value={setting.app_access_toggle} hendleChange={hendlChange} />
            <Page title="Setting">
              <Layout>
                {
                  dataCard.map((ele, index) => (
                    <Layout.AnnotatedSection
                      title={ele.heading} key={index}>
                      <Card sectioned>
                        <FormLayout>
                          {ele.value ? <p>{ele.value}</p> : ""}
                          <ButtonGroup>
                            {ele.content}
                          </ButtonGroup>
                        </FormLayout>
                      </Card>
                    </Layout.AnnotatedSection>
                  ))
                }
                {active}
              </Layout>
            </Page>
          </div>
      }
    </Frame>
  )
}
