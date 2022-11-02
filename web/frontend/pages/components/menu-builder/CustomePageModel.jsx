import { Button, FormLayout, Modal, Select, TextContainer, TextField, RadioButton, Grid, Card, TextStyle } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react';
import Parser  from 'html-react-parser';
import axios from 'axios';
export const CustomePageModel = (props) => {
  const Result = props.value;
  const id = Result.length;
  const getProfileData = props.getProfileData;
    const [active, setActive] = useState(false);
    const [toggle, setToggle] = useState(true);
    const [pages, setPages] = useState([]);
  const [defaultsvg, setdefaultsvg] = useState([]);
    const [state, setState] = useState({
      id:id,
      label: "",
      value:"",
      type:'page',
      svg:""
    })

    const handleChange = useCallback(() => {Clear(); setActive(!active), [active]});
  
    const activator = <Button onClick={handleChange}>Add Shopify Page</Button>;

    useEffect(() => {
      GetTranslations();
    }, [])
  

    
    const Submit = ()=>{
      Result.push(state);
      axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`,Result).then((response) => {
        getProfileData();
        handleChange();
        });
    }

    const Clear = () =>{
      setState({
      id:id,
      label: "",
      value:"",
      type:'page',
      svg:""
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
const loop = [{label:"Select Page", value:""}];
pages.map((ele)=>({label:ele.handle, value:ele.handle}));

    const GetTranslations=()=>{
      axios.get(`/api/get-pages?shop=${Shop_name}`).then((response) => {
        setPages(response.data);
       });

       axios.get(`/api/get-svg`).then((response) => {
        setdefaultsvg(response.data);
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
                name="label"
                value={state.label}
                onChange={(value) =>ChangeHendle(value,'label')} 
                autoComplete="off" />
                <Select
                label="Select Page"
                options={loop}
                name="value"
                value={state.value}
                allowMultiple
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
                    onChange={() =>ChangeHendle(ele.id,'svg')}
                    />        
                    </div>  
                    </Card>
                   </Grid.Cell>
                   )
                  }                
                </Grid>
                </FormLayout>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
