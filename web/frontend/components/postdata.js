
  
import {useAuthenticatedFetch} from "../hooks";
export default async function postdata(api,data){
const fetch = useAuthenticatedFetch();
    const rawResponse = await fetch(api, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
     return await rawResponse.json();
}