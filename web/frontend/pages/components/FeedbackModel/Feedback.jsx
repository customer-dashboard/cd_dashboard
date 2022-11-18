import { Button, FormLayout, Modal, TextContainer, TextField } from '@shopify/polaris'
import axios from 'axios';
import { useCallback, useState } from 'react'

export default function Feedback(props){
  const Result = props.value;
  const [error, setError] = useState('');
  const [state, setState] = useState({
    type:"link",
  })
    const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(true);
    const handleChange = useCallback(() => {Clear();setActive(!active), [active]});
    const activator = <Button onClick={handleChange}>{Result}</Button>;

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

  const Submit = ()=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email))
  {
    setError('');
    axios.post(`https://www.customerdashboard.pro/index.php`,state).then((response) => {
      });
  }else {
    setError("You have entered an invalid email address!")
    return (false)
  }
  }

  const Clear = () =>{
    setState({
      type:"link"
    });
  }
  return (
  
 <div>
            <Modal
            activator={activator}
            open={active}
            onClose={handleChange}
            title={Result}
            primaryAction={{
              content: 'Submit',
              onAction: Submit,
              disabled: toggle?true:false,
            }}
          >
            <Modal.Section>
              <TextContainer>
                <FormLayout.Group condensed>
                <TextField 
                 name='name' 
                 value={state.name}
                 onChange={(val) => ChangeHendle(val,'name')} 
                 label="Name"
                 autoComplete="off" />
                  <TextField 
                 name='email' 
                 value={state.email}
                 onChange={(val) => ChangeHendle(val,'email')} 
                 type="email"
                 error={error}
                 label="Email"
                 />
                 <TextField 
                 name='shopname' 
                 value={state.shopname=Shop_name}
                 onChange={(val) => ChangeHendle(val,'shopname')} 
                 label="Domain"
                 readOnly
                 autoComplete="off"
                 />
                 </FormLayout.Group>
                 <FormLayout.Group>
                 <TextField 
                 name='message' 
                 value={state.message}
                 onChange={(val) => ChangeHendle(val,'message')} 
                 label="Message"
                 multiline={4}
                 autoComplete="off" />
                 </FormLayout.Group>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
