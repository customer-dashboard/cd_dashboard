import { Avatar, Button, Card, Page,SkeletonPage,Layout,TextContainer,SkeletonDisplayText,SkeletonBodyText } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { useNavigate,useParams} from 'react-router-dom';
import axios from 'axios';
const Customer = () => {
const navigate = useNavigate();
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const [customer, setCustomer] = useState('');
const [orders, setOrders] = useState([]);
useEffect(() => {
  getCustomers();
  // getAllOrders();
  }, []);
  const getCustomers = ()=>{
    axios.get(`/get-customer/${id}/?shop=${Shop_name}`).then((response) => {
    setCustomer(response.data);
    });
  }

  const getAllOrders = ()=>{
    axios.get(`/get-orders?shop=${Shop_name}`).then((response) => {
      // setOrders(response.data.body);
      console.log(response.data.body);
    });
  }

  return (
    <Page title='Customer'
    breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}>  
    {
      customer!==""?
      <div style={{display:"flex", justifyContent:"space-between"}}>
<div style={{width:"49%"}}> 
       <Card title={<Avatar customer name="Farrah" />}  >
            <Card.Section title={`${customer.default_address?customer.default_address.first_name:""} ${customer.default_address?customer.default_address.last_name:""}`}>
                <p style={{width:"150px"}}>{`${customer.default_address?customer.default_address.first_name:""} ${customer.default_address?customer.default_address.last_name:""}, ${customer.default_address?customer.default_address.province_code:""},${customer.default_address?customer.default_address.country_name:""}`}</p>
            </Card.Section>
            <Card.Section>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <div><p>Last Order</p><p>5/4/2022</p></div>
                <p style={{width:"100px"}}>Lifetime Spend  $685.00  2 orders</p>
                <p style={{width:"100px"}}>Average Order Value $342.50</p>
              </div>
            </Card.Section>
        </Card>
        <Card>

            <Card.Section title="last order">
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <p style={{width:"100px"}}>Order #1024 ulfilled $0.00 </p>
                <p style={{width:"100px"}}>May 4, 2022 at 10:36 AM</p>
              </div>
            </Card.Section>
            <Card.Section>
           <div style={{width:"100%"}}> <Button >View All Orders</Button></div>
            </Card.Section>
        </Card>
        </div>
        <div style={{width:"49%"}}> 
       <Card>
            <Card.Section title="Customer Overview">
            <p>{customer.email}</p>
   
            </Card.Section>
            <Card.Section title="DEFAULT ADDRESS">          
                <div>
                <p>{customer.default_address?customer.default_address.first_name:""} {customer.default_address?customer.default_address.last_name:""}</p>
                <p>{customer.default_address?customer.default_address.company:""}</p>
                <p>{customer.default_address?customer.default_address.address1:""}</p>
                <p>{customer.default_address?customer.default_address.address2:""}</p>
                <div><span>{customer.default_address?customer.default_address.zip:""}</span>
                <span> {customer.default_address?customer.default_address.city:""}</span>
                <span> {customer.default_address?customer.default_address.province:""}</span>
                <span> {customer.default_address?customer.default_address.country:""}</span></div>
                <p>{customer.default_address?customer.default_address.phone:""}</p>
                </div>   
            </Card.Section>
        </Card>

        <Card>
            <Card.Section title="Email Marketing">
            <p>Edit Status</p>
            <p>Not subscribed</p> 
            <p>Unsubscribed on December 28, 2018</p>
            </Card.Section>
        </Card>
        </div>
</div>
      : <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
    }
    </Page>
  )
}

export default Customer