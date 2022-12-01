import {
  Loading,
  Card,
  Filters,
  DataTable,
  Page,
  Badge,
  Pagination,
  Frame
} from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from "../../hooks";
import SkeletonExample from '../SkeletonExample';

function Customers(props) {
  const {shop} = props;
  const [queryValue, setQueryValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const fetch = useAuthenticatedFetch();
  const [PrePage, setPrePage] = useState(undefined);
  const [NextPage, setNextPage] = useState(undefined);
  const [progress, setProgress] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (queryValue.length === 0 || queryValue.length > 2) fetchData("");
  }, [queryValue]);

  const fetchData = async (page) => {
    setProgress(true)
    const res = await fetch(`/api/get-customers?page=${page}&search=${queryValue}`);
    const content = await res.json();
    if(content.status===200){
      if(content.data.pageInfo){
        setNextPage(content.data.pageInfo.nextPage?.query.page_info)
       setPrePage(content.data.pageInfo.prevPage?.query.page_info)
      }else{
       setNextPage(undefined)
       setPrePage(undefined)
      }
       setCustomers(content.data.body.customers);
       setProgress(false);
       setLoading(false)
    }
  };
  const navigate = useNavigate();
  const handleFiltersQueryChange = useCallback((value) => setQueryValue(value), [],);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => { handleQueryValueRemove() }, [handleQueryValueRemove]);

  return (
<Frame>
  {
    loading?
    <SkeletonExample/>
    :
    <Page title='Customers'
    breadcrumbs={[{ content: 'Customers', onAction: () => navigate(-1) }]}>
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
      {progress ? <Loading /> : null}
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
        rows={customers.map((value) => {
          const data = [<a style={{ color: "black", textDecoration: "none" }} target="_blank" href={`https://${shop}/admin/customers/${value.id}`}>{value.first_name ? value.first_name : value.email}</a>, <p>{value.email_marketing_consent ? <Badge status="info">Subscribed</Badge> : null}</p>, <p>{value.default_address ? value.default_address.address1 : null}</p>, `${value.orders_count} Orders`, value.total_spent];
          return data;
        })}
      />
      <Card.Section>
        <div style={{ margin: "auto 50%" }}>
          <Pagination
            hasPrevious={PrePage===undefined? false:true}
            onPrevious={() => {
              fetchData(PrePage);
            }}
            hasNext={NextPage===undefined? false:true}
            onNext={() => {
              fetchData(NextPage);
            }}
          />
        </div>
      </Card.Section>
    </Card>
  </Page>
  }
</Frame>
  );
}

export default Customers