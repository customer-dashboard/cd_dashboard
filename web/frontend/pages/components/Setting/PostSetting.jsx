import axios from "axios";

const PostSetting = (props) => {
    axios.post(`/api/set-setting?shop=${Shop_name}`, props).then((response) => {
        let data = response.data;
        });
    }
    
export default PostSetting;