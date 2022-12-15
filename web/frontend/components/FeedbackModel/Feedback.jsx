import { Button, FormLayout, Modal, TextContainer, TextField } from '@shopify/polaris'
import { useCallback, useState } from 'react'
import { useAuthenticatedFetch } from '../../hooks';

export default function Feedback(props){
  const {value, shop} = props;
  const [error, setError] = useState('');
  const [state, setState] = useState({})
    const [active, setActive] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [toggle, setToggle] = useState(true);
    const handleChange = useCallback(() => {Clear();setActive(!active), [active]});
    const activator = <Button onClick={handleChange}>{value}</Button>;

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

  const Submit = async()=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email))
  {
    setError('');
    const getRequestFeature = await fetch('/api/set-requestFeature', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    const content = await getRequestFeature.json();
    if(content.status===200){
      console.log(content);
    }
  }else {
    setError("You have entered an invalid email address!")
    return (false)
  }
  }

  const Clear = () =>{
    setState({});
  }
  return (
  
 <div>
            <Modal
            activator={activator}
            open={active}
            onClose={handleChange}
            title={value}
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
                 value={state.shopname=shop}
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
