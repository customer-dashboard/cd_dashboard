import { Button, FormLayout, Modal, Select, TextContainer, TextField } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
export const CustomePageModel = (props) => {
  const Result = props.value;
  const getProfileData = props.getProfileData;
    const [active, setActive] = useState(false);
    const [toggle, setToggle] = useState(true);
    const [pages, setPages] = useState([]);
    const [state, setState] = useState({
      id:Result.length+1,
      type:'page'
    })

    const handleChange = useCallback(() => {Clear(); setActive(!active), [active]});
  
    const activator = <Button onClick={handleChange}>Add Shopify Page</Button>;

    useEffect(() => {
      GetTranslations();
    }, [])
  

    
    const Submit = ()=>{
      Result.push(state);
        axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`,Result).then((response) => {
        console.log(response);
        getProfileData();
        handleChange();
        });
    }

    const Clear = () =>{
      setState({
        id:Result.length+1,
        type:'page'
      });
    }

    const ChangeHendle = (value,name)=>{
      setState((preValue)=>{
        if(value)setToggle(false);
        else setToggle(true);  
        return{
          ...preValue,
          [name]:value
        }
      })
}

    const loop =  pages.map((ele,index)=>{
      return {label:ele.handle, value:ele.handle};
        })

  
    const GetTranslations=()=>{
      axios.get(`/api/get-pages?shop=${Shop_name}`).then((response) => {
        setPages(response.data);
       });
   }
   
  return (
    <div>
          <Modal
            activator={activator}
            open={active}
            onClose={handleChange}
            title="Add Shopify Page"
            primaryAction={{
              content: 'Add',
              onAction:Submit,
              disabled: toggle?true:false,
            }}
          >
            <Modal.Section>
            <TextContainer>
                <FormLayout>
                <TextField 
                label="Page Label" 
                name="title"
                value={state.title}
                onChange={(value) =>ChangeHendle(value,'title')} 
                autoComplete="off" />
                <Select
                label="Select Page"
                options={loop}
                name="value"
                value={state.value}
                onChange={(value) =>ChangeHendle(value,'value')} 
                />
                </FormLayout>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
