import { Button,  ButtonGroup,  FormLayout,  Frame,  Icon,  Modal, Select, Spinner, TextField, Toast } from '@shopify/polaris'
import {
  MinusMinor,PlusMinor,ThemeEditMajor
} from '@shopify/polaris-icons'; 
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
export default function EditFields(props){
  const {value,id,getProfileData,table} = props;
const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [local, setLocal] = useState([]);
  const [group, setGroup] = useState([{}])
  const [state, setState] = useState({
    label:"",
    value:"",
    name:"",
    type:"additional",
    multipleValue:[] 
  })

  const getField = ()=>{
    axios.get(`/api/get-profile-fields?shop=${Shop_name}`).then((response) => {
      if (response.data!=="") {
        const res = JSON.parse(response.data.value);
        setState(res[id]);
      if(res[id].multipleValue.length>0)setGroup(res[id].multipleValue);
      }
    });
  }

const handleChange = useCallback(() =>{getField();setActive(!active), [active]});
  const activator = <span style={{width:"15px", float:"right",cursor:"pointer",margin:"0px 10px 0"}} onClick={handleChange}> <ThemeEditMajor/></span>;
  const handleChange2=(name,value)=>{  
  setState((preValue)=>{
  return{...preValue,[name]:value,}});
}
  const options = [
    {label: 'Input', value: 'text'},
    {label: 'Date', value: 'date'},  
    {label: 'Textarea', value: 'textarea'},
    {label: 'Radio-Button', value:'radio'},
    {label: 'Checkbox', value: 'checkbox'},
  ];

  const groupChangval = (i,name,value) => {
    const newFormValues = [...group];
    newFormValues[i][name]=value;
    setGroup(newFormValues);
  }
  
  let addGroupField = () => {
    setGroup([...group,{value:""}])
    }
  
  let removeGroupField = (i) => {
    if(i>0){
      let newFormValues = [...group];
      newFormValues.splice(i, 1);
      setGroup(newFormValues)
    }
  }

useEffect(() => {
  GetLocal();
}, [])


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

  const Submit = () =>{
   state.multipleValue=group;
   const data = value.map((ele,index)=>{
    return index!==id?ele:state;
   })
  setLoading(true);
   local.forEach(element_2 => {
    axios.get(`/api/get-json?shop=${Shop_name}&locale=${element_2.locale}`).then((response) => {
      if(response.data){
        var arr = JSON.parse(response.data.value)[element_2.locale];
        const temp = arr.filter(obj1 => data.some(obj2 => obj2.label === obj1.heading&&obj1.name==="Shared"))
        temp.push({heading: state.label,value: state.label,name: "Shared"});
        for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].name === "Shared") { 
        arr.splice(i, 1);
        }
        }
        temp.forEach(element => {
        arr.push(element);
        });
        const data_local = {
          value:{[element_2.locale]:arr},
          locale:element_2.locale
        }
      axios.post(`/api/create-translations?shop=${Shop_name}`,data_local).then(() => {
        axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=${table}`,data).then(() => {
          getProfileData();
          handleChange();
          setLoading(false);
          });
      })

      }});
  });
}




  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title="Edit Field"
    >
      <Modal.Section>
              <FormLayout>
               <FormLayout.Group condensed>
                  <Select
                  label="Select field type"
                  placeholder="Select Type"
                  options={options}
                  onChange={(val)=>handleChange2("value",val)}   
                  value={state.value}
                  name="value"
                  />        
                  </FormLayout.Group>   
                  <FormLayout.Group>
                  <TextField              
                    value={state.label}
                    onChange={(val)=>handleChange2("label",val)}   
                    label="Field label"
                    name="label"
                    type="text" />     
                    </FormLayout.Group>                                                                        
                </FormLayout>
                {group.map((element, index) => (
            <div key={index}>
             {state&&state.value=='radio'||state.value=='checkbox'?
                    <TextField        
                    value={element.value}      
                    onChange={(val) => groupChangval(index,"value",val)}
                    label={`Value-${index+1}`}
                    name="value"
                    type="text"   
                    connectedRight={<ButtonGroup><Button onClick={() => removeGroupField(index)}><Icon source={MinusMinor}/></Button><Button onClick={() => addGroupField()}><Icon source={PlusMinor}color="base" /></Button></ButtonGroup>}
                    />  
                  :null}         
            </div>
          ))} 
          <br/>
          <ButtonGroup><Button primary loading={loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null} onClick={Submit}>Update</Button></ButtonGroup>
      </Modal.Section>
    </Modal>
  )
}
