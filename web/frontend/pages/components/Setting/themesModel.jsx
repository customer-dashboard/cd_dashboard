import { Button, FormLayout, Modal, Select, Toast} from "@shopify/polaris";
import axios from "axios";
import { useState, useCallback } from "react";

export const ThemesModel=(props)=>{
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('please select field');
  const [selected, setSelected] = useState("");
  const options = props.themes.map((theme,index)=>{
  return {id:index,label:theme.name,value:theme.id.toString()};
  })
  const [active2, setActive2] = useState(false);
  const handleSubmit = () =>{ 
    const data = {
      data:selected
    }
    if(selected!==""){ 
    // axios.post(`/api/theme-id?shop=${Shop_name}`,data).then((res) => {
    // if(res.status===200){
    //   setMessage(res.data);
    //   setActive2(true);
    // }
    // }) 
    }
    else{
      setActive2(true);
    }
   }


  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const activator = <Button primary onClick={handleChange}>Select Theme</Button>;

  return (
     <FormLayout>
        <FormLayout.Group condensed>
        <Select
      placeholder="Select Theme"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
    <Button primary onClick={handleSubmit}>Install Theme</Button>
        </FormLayout.Group>
       {active2 ?<Toast content={message} onDismiss={()=>{setActive2(false);setActive(false);}}/>: null}
      </FormLayout>
  );
}

