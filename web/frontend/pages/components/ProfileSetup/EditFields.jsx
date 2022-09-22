import { Button,  ButtonGroup,  FormLayout,  Frame,  Icon,  Modal, Select, TextField, Toast } from '@shopify/polaris'
import {
  ThemeEditMajor,
  MinusMinor,PlusMinor
} from '@shopify/polaris-icons'; 
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
export const EditFields = ({getAdditionalData,table,id}) => {
  const [active, setActive] = useState(false);
  const [group, setGroup] = useState([{}])
  const [getSigleField, setGetSigleField] = useState([])
  const [state, setState] = useState({
    label:"sdsd",
    field:"",
  })
  const [result, setResult] = useState('')
  const [active2, setActive2] = useState(false);

    const getField = ()=>{
      axios.get(`/api/get-single-data/${id}?shop=${Shop_name}&query=${table}`).then((response) => {
        setGetSigleField(response.data)
        const res = JSON.parse(response.data[0].fields)
        setState(res.singleFields);
        if(res.multipleFields.length>0)setGroup(res.multipleFields);
      });
    }


  const toggleActive = useCallback(() => setActive2((active2) => !active2), []);
  const handleChange = useCallback(() =>{getField();Clear();setActive(!active), [active]});
  const activator = <span style={{width:"17px", float:"right",cursor:"pointer",margin:"2px 10px 0 0px"}} onClick={handleChange}> <ThemeEditMajor/></span>;
  const handleChange2=(name,value)=>{  
  setState((preValue)=>{
  return{...preValue,[name]:value,}});
}
  const options = [
    {label: 'Input', value: 'text'},
    {label: 'Email', value: 'email'},
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

  const Clear = ()=>{
    setGroup([{}]);
    setState({label:"", field:""});
  }

  const Submit = () =>{
   const data = {
    singleFields:state,
    multipleFields:group
   }
    axios.post(`/api/update-single-data?id=${id}&shop=${Shop_name}&query=profile_additional_fields`,data).then((response) => {
    if(response.status===200){
      setResult(response.data);
      setActive(false);
      getAdditionalData();
    }
    })
  }

  const toastMarkup = active2 ? (
    <Toast content={result} onDismiss={toggleActive} />
  ) : null;


  return (
<>
 {activator}
    <Modal
      open={active}
      onClose={handleChange}
      title=" Edit Field"
    >
      <Modal.Section>
              <FormLayout>
               <FormLayout.Group condensed>
                  <Select
                  label="Select field type"
                  placeholder="Select Type"
                  options={options}
                  onChange={(val)=>handleChange2("field",val)}   
                  value={state.field}
                  name="field"
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
             {state&&state.field=='radio'||state.field=='checkbox'?
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
        <ButtonGroup><Button primary onClick={Submit}>Update</Button><Button onClick={Clear}>Clear</Button></ButtonGroup>
        {toastMarkup}
      </Modal.Section>
    </Modal>
    </>
  )
}
