import { 
  Button,
  ButtonGroup,
  FormLayout,
  Icon,
  Modal,
  Select,
  Spinner,
  TextField
} from '@shopify/polaris'
import {
  MinusMinor,
  PlusMinor
} from '@shopify/polaris-icons'; 
import {
  useCallback,
  useEffect,
  useState
} from 'react'
export default function AddFieldsModel(props){
  const {getAdditionalData, activeConfirm}=props;
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState([{}])
  const [state, setState] = useState({
    label:"",
    value:"",
    name:"",
    type:"additional",
    multipleValue:[]
  })
  
  const handleChange = useCallback(() =>{Clear();setActive(!active), [active]});
  const activator = <Button primary onClick={handleChange}>Add Fields</Button>;
  const handleChange2=(name,value)=>{  
  setState((preValue)=>{
    if(value)setToggle(false);
    else setToggle(true);  
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
  
  useEffect(() => {
    if(activeConfirm===false){
      setActive(activeConfirm);
      setLoading(false);
    }
    },[activeConfirm])

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
    setLoading(false)
    setGroup([{}]);
    setState({label:"", value:"",type:"additional",});
  }

  const Submit = () =>{
   state.multipleValue=group;
   getAdditionalData(state);
   setLoading(true);
  }

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title="Create New Field"
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
        {!toggle?<ButtonGroup><Button primary loading={loading ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : null} onClick={Submit}>Create</Button><Button onClick={Clear}>Clear</Button></ButtonGroup>:<Button disabled >Create</Button>} 
      </Modal.Section>
    </Modal>
  )
}
