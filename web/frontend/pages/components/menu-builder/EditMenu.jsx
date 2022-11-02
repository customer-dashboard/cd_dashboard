import {Card, FormLayout, Grid, Modal, RadioButton, Select, TextContainer, TextField, TextStyle } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import Parser  from 'html-react-parser';
import { ThemeEditMajor } from '@shopify/polaris-icons';
export const EditMenu = (props) => {
  const {value,id,getProfileData,table} = props;
  const [state, setState] = useState(value[id])
  const [pages, setPages] = useState([]);
  const [defaultsvg, setdefaultsvg] = useState([]);
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
     axios.get(`/api/get-svg`).then((response) => {
      setdefaultsvg(response.data);
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
   const data = value.map((ele,index)=>{
     return index!==id?ele:state;
    })
      axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=${table}`,data).then((response) => {
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
                 name='label' 
                 value={state.label}
                 onChange={(val) => ChangeHendle(val,'label')} 
                 autoComplete="off" />
                {
                  value[id]&&value[id].type==='page'?
                  <>
                  <Select
                  label="Select Page"
                  options={loop}
                  name="value"
                  value={state.value}
                  onChange={(value) =>ChangeHendle(value,'value')} 
                  />
                  <TextStyle>Select Svg Icon</TextStyle>
                  <Grid>
                  {
                   defaultsvg.map((ele,index)=>
                   <Grid.Cell key={index} columnSpan={{xs: 6, sm: 3, md: 3, lg: 2, xl: 2}}>                    
                    <Card>
                      <div style={{padding:"10px"}}>
                    <RadioButton
                    label={Parser(ele.svg)}  
                    name="svg"
                    value={state.svg}
                    checked={state.svg===ele.id}
                    onChange={() =>ChangeHendle(ele.id,'svg')}
                    />        
                    </div>  
                    </Card>
                   </Grid.Cell>
                   )
                  }                
                </Grid>
                  </>
                  : <TextField label="Link" 
                  name='value' 
                  value={state.value}
                  onChange={(val) => ChangeHendle(val,'value')} 
                  autoComplete="off" 
                  multiline={4}
                  placeholder='https://' />
                }
                </FormLayout>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
