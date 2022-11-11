import { Button, FormLayout, Modal, Select, TextContainer, TextField, RadioButton, Grid, Card, TextStyle, Spinner } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react';
import Parser  from 'html-react-parser';
import axios from 'axios';
export const CustomePageModel = (props) => {
  const Result = props.value;
  const id = Result.length;
  const getProfileData = props.getProfileData;
    const [active, setActive] = useState(false);
const [loading, setLoading] = useState(false);
const [local, setLocal] = useState([]);
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
      GetLocal();
      getSvgIcon();
    }, [])
  
  
    const getSvgIcon = () =>{
      axios.get(`/api/get-svg?shop=${Shop_name}`).then((response) => {
        if (response.data!=="")setdefaultsvg(response.data);
      })
    }


    function add(arr, name) {
      const found = arr.some(el => el.heading === name);
      if (!found) arr.push({heading: name,value: name,name: "Navigation"});
      return arr;
    }
    
    const Submit = ()=>{
      Result.push(state);
      setLoading(true);
      local.forEach(element_2 => {
      axios.get(`/api/get-json?shop=${Shop_name}&locale=${element_2.locale}`).then((response) => {
          if(response.data){
            var arr = JSON.parse(response.data.value)[element_2.locale];
            var array = [];
            Result.forEach(element => {
              array=add(arr, element.label);
            });
            const data = {
              value:{[element_2.locale]:array},
              locale:element_2.locale
            }
            
          axios.post(`/api/create-translations?shop=${Shop_name}`,data).then(() => {
            axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`,Result).then(() => {
              getProfileData();
              handleChange();
              setLoading(false);
                });
          })
          }
        });
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
pages.map((ele)=>(loop.push({label:ele.handle, value:ele.handle})));

const GetLocal = () => {
  const query = `query MyQuery{
    shopLocales {
      locale
      name
      primary
      published
    }
  }`;

  const data = { query: query }
  axios.post(`/api/graphql-data-access?shop=${Shop_name}`, data).then((response) => {
    setLocal(response.data.body.data.shopLocales);
  });
}


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
              loading:loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null,
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
