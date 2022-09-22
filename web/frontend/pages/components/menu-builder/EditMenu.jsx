import { Button, FormLayout, Modal, Page, Select, TextContainer, TextField } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { ThemeEditMajor } from '@shopify/polaris-icons';
export const EditMenu = (props) => {
  const Result = props.value;
  const getProfileData = props.getProfileData;
  const [state, setState] = useState(Result[props.id])
  const [pages, setPages] = useState([]);
    const [active, setActive] = useState(false);
    const handleChange = useCallback(() => {setActive(!active), [active]});
  const activator = <span style={{width:"15px", float:"right",cursor:"pointer",margin:"0px 10px 0"}} onClick={handleChange}> <ThemeEditMajor/></span>;

  const loop =  pages.map((ele)=>{
    return {label:ele.handle, value:ele.handle};
      })

      useEffect(() => {
        GetTranslations();
      }, [])

  const GetTranslations=()=>{
    axios.get(`/api/get-pages?shop=${Shop_name}`).then((response) => {
      setPages(response.data);
     });
 }

  const ChangeHendle = (value,name)=>{
        setState((preValue)=>{
          return{
            ...preValue,
            [name]:value
          }
        })
  }
  const Submit = ()=>{
   const data = Result.map((ele,index)=>{
     return index!==props.id?ele:state;
    })
      axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`,data).then((response) => {
      console.log(response);
      getProfileData();
      handleChange();
      });
  }

  return (
  
 <div>
            <Modal
            activator={activator}
            open={active}
            onClose={handleChange}
            title="Add Custom Link"
            primaryAction={{
              content: 'Add',
              onAction: Submit,
            }}
          >
            <Modal.Section>
            <TextContainer>
                <FormLayout>
                <TextField label="Link Label"
                 name='title' 
                 value={state.title}
                 onChange={(val) => ChangeHendle(val,'title')} 
                 autoComplete="off" />
                {
                  Result[props.id]&&Result[props.id].type==='page'?
                  <Select
                  label="Select Page"
                  options={loop}
                  name="value"
                  value={state.value}
                  onChange={(value) =>ChangeHendle(value,'value')} 
                  />
                  : <TextField label="Link" 
                  name='value' 
                  value={state.value}
                  onChange={(val) => ChangeHendle(val,'value')} 
                  autoComplete="off" 
                  placeholder='https://' />
                }
                </FormLayout>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
