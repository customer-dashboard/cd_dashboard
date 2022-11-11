import { Button, FormLayout, Modal, TextContainer, TextField } from '@shopify/polaris'
import { useCallback, useState } from 'react'

export const Feedback = (props) => {
  const Result = props.value;
  const [state, setState] = useState({
    type:"link"
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
    //   axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`,Result).then((response) => {
    //   getProfileData();
    //   handleChange();
    //   });
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
               
              {
                Result==="Request A Feature"? <FormLayout>
                <TextField label="Title"
                name='title' 
                value={state.title}
                onChange={(val) => ChangeHendle(val,'title')} 
                autoComplete="off" />
                 <TextField label="Description" 
                 name='value' 
                 value={state.value}
                 onChange={(val) => ChangeHendle(val,'value')} 
                 autoComplete="off" 
                 multiline={4}
                 placeholder='Message:-' />
                </FormLayout>:
                <FormLayout>
                <TextField 
                 name='value' 
                 value={state.value}
                 onChange={(val) => ChangeHendle(val,'value')} 
                 autoComplete="off" 
                 multiline={4}
                 placeholder='Message:-' />
                 </FormLayout>
              }
                
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
