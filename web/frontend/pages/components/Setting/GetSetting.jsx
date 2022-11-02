import axios from 'axios';
import { useEffect, useState } from 'react'
import jsonsetting from './json/setting.json';
const GetSetting = () => {
    const [getData, setGetdata] = useState(jsonsetting);  
    useEffect(() => {
        getsettingData();
    }, [])
    
    const getsettingData = () =>{
        axios.get(`/api/get-setting?shop=${Shop_name}`).then((response) => {
        let data = response.data[0].setting;
        setGetdata(JSON.parse(data));
        });
    }
    
return getData;
}
export default GetSetting;
