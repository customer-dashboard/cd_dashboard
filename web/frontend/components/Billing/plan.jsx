import { Button,Card,Grid,Layout, Page, TextStyle, Frame, Link } from '@shopify/polaris'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from "../../hooks";
import SkeletonExample from '../SkeletonExample';
export default function Billing() {
  const [billing, setBilling] = useState({});
  const [progress, setProgress] = useState(true);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const cardData = [
    {
      title: "0-1500 Customers", price: "", content: "Free",
      value: [
        "Free",
        "Improved Account page",
        "Multilingual",
        "Quick Reorder",
        "Manage Profile",
        "Extra pages (Unlimited)",
        "Custom fields",
        "Contact Form in Order History"
      ]
    },
    {
      title: "1500+ Customers", price: "4.00", content: "Upgrade",
      value: [
        "4$/month",
        "Improved Account page",
        "Multilingual",
        "Quick Reorder",
        "Manage Profile",
        "Extra pages (Unlimited)",
        "Custom fields",
        "Contact Form in Order History"
      ]
    },
    // { title: "Standard", price:"7.00", content: "Upgrade", value: ["7$/month", "100k customers", "New Account page", "Multi language support", "Reorder", "Order history", "Add custom pages and links"] },
  ]
  useEffect(() => {
    getPaymentList();
  }, [])

  const getPaymentList = async () => {
    const response = await fetch("/api/get-billing");
    const content = await response.json();
    if (content.status == 200) {
      setBilling(content.data);
      setProgress(false);
    }
  }
  const postPayment = async (price, name) => {
    const data = {
      required: true,
      chargeName: name,
      amount: price,
      currencyCode: "USD",
      interval: "EVERY_30_DAYS"
    }
    await fetch('/api/graphql-billing', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
  return (
    <Frame>
      {
        progress ? <SkeletonExample /> :
          <>
            <Page title={<div><span>Plan </span><span style={{fontSize:"14px"}}>(14-DAY FREE TRIAL)</span></div>}
              breadcrumbs={[{ content: 'Products', onAction: () => navigate(-1) }]}
            >
              <Grid>
                {cardData.map((ele, index) => (
                  <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                    <Card title={ele.title} sectioned>
                      {
                        ele.value.map((val, index) => (
                          <TextStyle key={index} variation="subdued" >{index === 0 ? <p className='paidCard'><b>{val}</b></p> : <p className='paidCard'>{val}</p>}</TextStyle>)
                        )
                      }
                      {billing && billing.status === 'active' && billing.name === ele.title || ele.content === "Free" ?
                        ele.content === "Free" ? <Button disabled fullWidth>
                          Free Forever
                        </Button> :
                          <span style={{ color: '#008000 ' }}>
                            <Button outline monochrome fullWidth>
                              Active
                            </Button></span>
                        : <Button primary onClick={() => postPayment(ele.price, ele.title)} fullWidth>{ele.content}</Button>}
                    </Card>
                  </Grid.Cell>
                ))}
              </Grid>
            </Page>
            <Page>
              <Layout>
                <Layout.AnnotatedSection
                  title="Need Help?">
                  <Card sectioned>
                    <p>Send us an email</p>
                    <Link removeUnderline url="mailto:support@customerdashboard.pro" external>Go To Support</Link>
                  </Card>
                </Layout.AnnotatedSection>
              </Layout>
            </Page>
          </>
      }
    </Frame>
  )
}
