import {Card, FormLayout, Grid, Modal, RadioButton, Select, Spinner, TextContainer, TextField, TextStyle } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import { useAuthenticatedFetch } from "../../hooks";
import Parser  from 'html-react-parser';
import { ThemeEditMajor } from '@shopify/polaris-icons';
export default function EditMenu(props){
  const {value,id,getProfileData,table} = props;
  const [state, setState] = useState(value[id])
  const [local, setLocal] = useState([]);
const [loading, setLoading] = useState(false);
  const fetch = useAuthenticatedFetch();
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
        GetLocal();
        getSvgIcon();
      }, [])
      const getSvgIcon = async() =>{
        const res = await fetch(`/api/get-svg`);
        const content = await res.json();
        setdefaultsvg(content);
      }

  const GetTranslations=async ()=>{
    const res = await fetch(`/api/get-pages`);
    const content = await res.json();
    setPages(content);
 }

 const GetLocal = async() => {
  const query = `query MyQuery{
    shopLocales {
      locale
      name
      primary
      published
    }
  }`;

  const data = { query: query }
  const response = await fetch('/api/graphql-data-access', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
const content = await response.json();
setLocal(content.body.data.shopLocales);
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
    setLoading(true);
    local.forEach(async(element_2) => {
      const res = await fetch(`/api/get-json?locale=${element_2.locale}`);
      const content = await res.json();
      if(content){
        var arr = JSON.parse(content.value)[element_2.locale];
        const temp = arr.filter(obj1 => data.some(obj2 => obj2.label === obj1.heading&&obj1.name==="Navigation"))
        temp.push({heading: state.label,value: state.label,name: "Navigation"});
        const result = temp.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.heading === thing.heading
        ))
      )
        for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].name === "Navigation") { 
        arr.splice(i, 1);
        }
        }
        result.forEach(element => {
        arr.push(element);
        });
        const data_local = {
          value:{[element_2.locale]:arr},
          locale:element_2.locale
        }
     await fetch('/api/create-translations', {
          method: 'POST',
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          body: JSON.stringify(data_local)
        });
       const data_retrun = await fetch(`/api/post-reorder-fields?query=${table}`, {
          method: 'POST',
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const content_return = data_retrun.json();
        if(content_return){
          getProfileData();
          handleChange();
          setLoading(false);
        }
      }
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
              loading:loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null,
              content: 'Update',
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
