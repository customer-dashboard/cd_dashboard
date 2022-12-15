import { InstallApp } from "../components/Install/InstallApp";

export default function installation(props){
  const {shop} = props;
  return (
    <div>
      <InstallApp shop={shop}/>
    </div>
  )
}
