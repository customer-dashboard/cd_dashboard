import Customers from "../components/Customers/customers";
export default function customers(props){
  const {shop} = props;
  return (
    <div>
      <Customers shop={shop}/>
    </div>
  )
}
