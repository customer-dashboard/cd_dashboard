import { Button, ButtonGroup, Card, FormLayout, Layout, Page, TextStyle, ContextualSaveBar, Toast, Link, Frame } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Feedback from './FeedbackModel/Feedback'
import Toggle from './Toggle'
import SkeletonExample from './SkeletonExample'
import { useAuthenticatedFetch } from "../hooks";

export default function HomePage(props) {
  const {shop} = props;
  const [progress, setProgress] = useState(true)
  const [setting, setSetting] = useState({});
  const fetch = useAuthenticatedFetch();
  const [count, setCount] = useState({});
  const [billing, setBilling] = useState({});
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  
  const cardData = [
    { title: "Customers", content: <NavLink to="/customers">View Customers</NavLink>, value: count?.customer_count },
    { title: "Order", content: <Link url={`https://${shop}/admin/orders`} external>All Orders</Link>, value: count?.order_count },
    { title: "Current Plan", content: "", value: billing && billing.status === 'active' ? billing.name : "Basic-Free" },
  ]
  const dataCard = [
    { heading: "Translations", value: "Add translations to use Customer Dashboard in any language.", content: "Manage Translations", link: "/translations" },
    { heading: "Plan", value: "Basic-Free", content: "Upgrade Plan", link: "/plan" },
    { heading: "Need Help", value: "", content: "Go To Support", link: "" },
    { heading: "What Do You Think About This App", value: "", content: "Give Us Feedback", link: "/" },
    { heading: "Don't Have What You Need", value: "", content: "Request A Feature", link: "" },
  ]

  useEffect(() => {
    getPaymentList();
    getSetting();
    getLength();
  }, [])

  const contextualSaveBarMarkup = save ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
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

  const getPaymentList = async() =>{
    const response = await fetch("/api/get-billing");
    const content = await response.json();
    setBilling(content);
  }

  const getSetting = async () => {
    const getSetting = await fetch("/api/get-setting");
    const content = await getSetting.json();
    setSetting(content);
  }

  const getLength = async () => {
    const getSetting = await fetch("/api/get-length");
    const content = await getSetting.json();
    setCount(content);
    setProgress(false);
  }

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
        progress ?
          <SkeletonExample /> :
          <>
            <Page title='Dashboard'>
              {contextualSaveBarMarkup}
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
                            {ele.link ? <NavLink className='link' to={ele.link}><Button>{ele.content ? ele.content : ""}</Button></NavLink> : <Feedback value={ele.content} shop={shop} />}
                          </ButtonGroup>
                        </FormLayout>
                      </Card>
                    </Layout.AnnotatedSection>
                  ))
                }
                {active}
              </Layout>
            </Page>
          </>
      }
    </Frame>
  )
}
