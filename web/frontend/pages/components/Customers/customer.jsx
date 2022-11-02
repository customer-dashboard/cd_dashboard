import { Avatar, Button, Card, Page,SkeletonPage,Layout,ResourceList,Thumbnail,TextStyle, Stack, EmptyState, Badge } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
const Customer = () => {
const navigate = useNavigate();
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const [customer, setCustomer] = useState([]);
const [orders, setOrders] = useState();
useEffect(() => {
  getCustomer();
  getOrders();
  }, []);
  const getCustomer = ()=>{
    axios.get(`/api/get-customer/${id}/?shop=${Shop_name}`).then((response) => {
    setCustomer(response.data);
    });
  }
  const getOrders = ()=>{
    axios.get(`/api/get-orders/${id}/?shop=${Shop_name}`).then((response) => {
      // setOrders(response.data.orders[0]);
      console.log(response.data.orders);
    });
  }

  const redirect = () =>{
   return window.open(`https://${Shop_name}/admin/orders`, '_blank');
  }

 return (
    <Page title='Customer'
    breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}>  
<Layout>
        <Layout.Section>
          <Card title={customer.default_address?customer.default_address.name:null} sectioned>
            <p>{customer.default_address?customer.default_address.city+" "+customer.default_address.province_code+" "+customer.default_address.country_name:null}</p>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Card.Section>
            <div style={{display:"flex",justifyContent:"space-between"}}>
            <TextStyle><p>Amount spent</p><TextStyle variation="strong">${customer.total_spent?customer.total_spent:0}</TextStyle></TextStyle>
            <TextStyle><p>Orders</p><TextStyle variation="strong">{customer.orders_count?customer.orders_count:0}</TextStyle></TextStyle>
            <TextStyle><p>Average order value</p><TextStyle variation="strong"></TextStyle></TextStyle>
           </div>
            </Card.Section>
          </Card>
          <Card title="Last Order">
            <Card.Section>
            {/* <Stack>
      <Heading>{customer.last_order_name}</Heading>
      <Badge progress="complete">Paid</Badge>
      <Badge progress="incomplete" status="attention">Fulfilled</Badge>
    </Stack> */}
     <EmptyState
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
      </EmptyState>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card title="Customer Overview">
            <Card.Section>
              <TextStyle variation="subdued">{customer.email}</TextStyle>
            </Card.Section>
            <Card.Section title="Default Addrerss">
              <TextStyle variation="subdued"><p>{customer.default_address?customer.default_address.name:null}</p></TextStyle>
              <TextStyle variation="subdued"><p>{customer.default_address?customer.default_address.company:null}</p></TextStyle>
              <TextStyle variation="subdued"><p>{customer.default_address?customer.default_address.address1:null}</p></TextStyle>
              <TextStyle variation="subdued"><p>{customer.default_address?customer.default_address.address2:null}</p></TextStyle>
              <TextStyle variation="subdued">{customer.default_address?customer.default_address.zip:null}</TextStyle>
              <TextStyle variation="subdued"> {customer.default_address?customer.default_address.city:null}</TextStyle>
              <TextStyle variation="subdued"> {customer.default_address?customer.default_address.province:null}</TextStyle>
              <TextStyle variation="subdued"><p>{customer.default_address?customer.default_address.country_name:null}</p></TextStyle>
              <TextStyle variation="subdued"><p>{customer.default_address?customer.default_address.phone:null}</p></TextStyle>
            </Card.Section>
            <Card.Section title="Marketing status">
             <p>{customer.email_marketing_consent ?<Badge status="info">Email Subscribed</Badge>:<Badge>Email Not Subscribed</Badge>}</p>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default Customer