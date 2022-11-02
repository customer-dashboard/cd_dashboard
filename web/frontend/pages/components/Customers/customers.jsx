import {
  ChoiceList,
  Loading,
  Card,
  Filters,
  DataTable,
  Page,
  Badge,
  Pagination
} from '@shopify/polaris';
import axios from 'axios';
import {useState, useCallback, useEffect} from 'react';
import {useNavigate } from 'react-router-dom';

function Customers() {
  const [CustomersLength, setCustomersLength] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [preValue, setPreValue] = useState(0);
  const [nextValue, setNextValue] = useState(50);
const [progress, setProgress] = useState(false)
  useEffect(() => {
    if (queryValue.length === 0 || queryValue.length > 2) fetchData();
  }, [queryValue,preValue,nextValue]);

  const fetchData = async () => {
    setProgress(true)
    const res = await axios.get(`/api/get-customers?shop=${Shop_name}&q=${queryValue}`);
    setProgress(false);
    setCustomers(res.data.slice(preValue,nextValue));
    setCustomersLength(res.data.length);
  };
const navigate = useNavigate();
  const handleFiltersQueryChange = useCallback((value) => setQueryValue(value),[],);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {handleQueryValueRemove()}, [handleQueryValueRemove]);

  return (
       <Page title='Customers'
       breadcrumbs={[{content: 'Customers',onAction:()=>navigate(-1)}]}>
      <Card>
        <Card.Section>
          <Filters
            queryValue={queryValue}
            filters={[]}
            // appliedFilters={appliedFilters}
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleFiltersClearAll}
          />
        </Card.Section>
        {progress?<Loading />:null}
        <DataTable
         columnContentTypes={[
            'text',
            'text',
            'text',
            'numeric',
            'text',
          ]}
          headings={[
            'Customer Name',
            'Email subscription',
            'Location',
            'Orders',
            'Spent',
          ]}
          rows={customers.map((value)=>{
            const data = [<a style={{color:"black",textDecoration:"none"}} target="_blank" href={`https://${Shop_name}/admin/customers/${value.id}`}>{value.first_name?value.first_name:value.email}</a>,<p>{value.email_marketing_consent ?<Badge status="info">Subscribed</Badge>:null}</p>,<p>{value.default_address?value.default_address.address1:null}</p>,`${value.orders_count} Orders`,value.total_spent];
            return data;
          })}
        />
        <Card.Section>
          <div style={{margin:"auto 50%"}}>
          <Pagination
      hasPrevious={preValue>0?true:false}
      onPrevious={() => {
        setPreValue(preValue-50);
        setNextValue(nextValue-50);
      }}
      hasNext={CustomersLength>nextValue?true:false}
      onNext={() => {
        setPreValue(preValue+50);
        setNextValue(nextValue+50);
      }}
    />
          </div>
        </Card.Section>
      </Card>
    </Page>
  );
}

export default Customers