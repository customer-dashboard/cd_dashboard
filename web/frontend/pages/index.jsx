import HomePage from "../components/HomePage";

export default function Home(props){
  const {shop,billing,count} = props;
  return (
    <>
    <HomePage shop={shop} billing={billing} count={count}/>
    </>
  )
}
