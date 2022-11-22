import { Button, ButtonGroup, Card, FormLayout, Grid, Toast, Layout, Page, TextStyle, Frame } from '@shopify/polaris'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {useAuthenticatedFetch } from "../../hooks";
import SkeletonExample from '../SkeletonExample';
export default function Billing(){
  const [billing, setBilling] = useState({});
  const [progress, setProgress] = useState(true);
  const [save, setSave] = useState("");
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const cardData = [
    { title: "Basic", price: "", content: "Free", value: ["Free", "1500 customers", "New Account page", "Multi language support", "Reorder", "Order history", "Add custom pages and links"] },
    { title: "Standard", price: "4.00", content: "Upgrade", value: ["4$/month", "1500+ customers", "New Account page", "Multi language support", "Reorder", "Order history", "Add custom pages and links"] },
    // { title: "Standard", price:"7.00", content: "Upgrade", value: ["7$/month", "100k customers", "New Account page", "Multi language support", "Reorder", "Order history", "Add custom pages and links"] },
  ]
  const needHelp = [
    { heading: "Need Help", value: "", content: "Go To Support", link: "" },
  ]

  useEffect(() => {
    getPaymentList();
  }, [])
  
  const getPaymentList = async() =>{
    const response = await fetch("/api/get-billing");
    const content = await response.json();
    setBilling(content);
    setProgress(false);
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
  progress?<SkeletonExample/>:
  <>
  <Page title='Plan'
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
            {billing && billing.status === 'active'&& billing.name === ele.title || ele.content==="Free" ?
            ele.content==="Free"? <Button disabled fullWidth>
             Free Forever
            </Button>:
            <span style={{ color: '#008000 ' }}>
            <Button  outline monochrome fullWidth>
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
      {
        needHelp.map((ele, index) => (
          <Layout.AnnotatedSection
            title={ele.heading} key={index}>
            <Card sectioned>
              <FormLayout>
                {ele.value ? <p>{ele.value}</p> : ""}
                <ButtonGroup>
                  {ele.link ? <Link to={ele.link}><Button>{ele.content ? ele.content : ""}</Button></Link> : <Button>{ele.content ? ele.content : ""}</Button>}
                </ButtonGroup>
              </FormLayout>

            </Card>
          </Layout.AnnotatedSection>
        ))
      }
    </Layout>
    {save}
  </Page>
</>
}
</Frame>
  )
}
