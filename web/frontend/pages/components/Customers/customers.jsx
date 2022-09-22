import {Card,DataTable,Page,SkeletonPage,Layout,TextContainer,SkeletonDisplayText,SkeletonBodyText} from '@shopify/polaris';
import axios from 'axios';
import {useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';


const Customers = ()=> {
  const [customers, setCustomers] = useState([]);
  const customers2 = [];
  useEffect(() => {
    getCustomers();
    }, [])
    const getCustomers = ()=>{
    axios.get(`/api/get-customers?shop=${Shop_name}`).then((res)=>setCustomers(res.data));
    }

customers.map((value)=>{
  const data = [<Link to={`/components/customers/customer?id=${value.id}`}>{value.first_name} {value.last_name}</Link>,value.accepts_marketing.toString(),<p className='sunil'>{value.default_address?value.default_address.address1:null}</p>,`${value.orders_count} Orders`];
  customers2.push(data);
})
const navigate = useNavigate();
  return (
    <Page title='Customers'
    breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}>
    {
      customers2.length>0?
        <Card>
        <Card.Section>
        </Card.Section>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'numeric',
            'numeric',
          ]}
          headings={[
            'Customer Name',
            'Status',
            'Location',
            'Orders',
          ]}
          rows= {customers2}
          // totals={['', '',255, '$155,830.00']}
        />
      </Card>
      :    <SkeletonPage>
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
  );
}

export default Customers