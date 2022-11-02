import { Button, ButtonGroup, Card, FormLayout, Grid, Layout, Page, TextStyle } from '@shopify/polaris'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from 'react';
const Billing = () => {
  const navigate = useNavigate();
  const cardData = [
    { title: "Basic", content: "Free", value: ["Free", "1500 customers", "New Account page", "Multi language support", "Reorder", "Order history", "Add custom pages and links"] },
    { title: "Standard", content: "Upgrade", value: ["4$/month", "1500+ customers", "New Account page", "Multi language support", "Reorder", "Order history", "Add custom pages and links"] },
    // {title:"Standard",content:"",value:"4$/month, 1500+ customers, New Account page, Multi language support, Reorder, Order history, Add custom pages and links"},
  ]
  const needHelp = [
    { heading: "Need Help", value: "", content: "Go To Support", link: "" },
  ]

  const postPayment = () => {
    const data = `query appSubscription {    currentAppInstallation {      activeSubscriptions {        name        test      }    }  }`;
    //    const data={"query": `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $test: Boolean) {
    //     appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, test: $test) {
    //       userErrors {
    //         field
    //         message
    //       }
    //       appSubscription {
    //         id
    //       }
    //       confirmationUrl
    //     }
    //   }`,
    //   "variables": {
    //     "test":true,
    //     "name": "Customer_dashboard",      
    //     "returnUrl": "https://"+Shop_name+"/admin/apps/dashboard-app-4",
    //     "lineItems": [
    //       {
    //         "plan": {
    //           "appRecurringPricingDetails": {
    //             "price": {
    //               "amount": 11.00,
    //               "currencyCode": "USD"
    //             },
    //             "interval": "EVERY_30_DAYS"
    //           }
    //         }
    //       }
    //     ]
    //   }
    // }
    axios.post(`/api/graphql-billing?shop=${Shop_name}`, JSON.stringify(data)).then((response) => {
      // window.top.location=`${response.data.body.data.appSubscriptionCreate.confirmationUrl}`;
    });
  }

  return (
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
                {ele.content !== "Free" ? <Button primary onClick={postPayment} fullWidth>{ele.content}</Button> : <Button primary disabled fullWidth>{ele.content}</Button>}
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
      </Page>
    </>
  )
}

export default Billing