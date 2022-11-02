import { Button, FormLayout, Modal, Page, Select, TextContainer, TextField } from '@shopify/polaris'
import { useCallback, useState } from 'react'
import axios from 'axios';
export const CustomeLinkPage = (props) => {
  const Result = props.value;
  const id = Result.length;
  const getProfileData = props.getProfileData;
  const [state, setState] = useState({
    id: id,
    label: "",
    value: "",
    type: 'link',
    svg: ""
  })
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(true);
  const handleChange = useCallback(() => { Clear(); setActive(!active), [active] });
  const activator = <Button onClick={handleChange}>Add Custom Link</Button>;

  const ChangeHendle = (value, name) => {
    setState((preValue) => {
      if (value) setToggle(false);
      else setToggle(true);
      return {
        ...preValue,
        [name]: value
      }
    })
  }

  const Submit = () => {
    Result.push(state);
    axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`, Result).then((response) => {
      getProfileData();
      handleChange();
    });
  }

  const Clear = () => {
    setState({
      id: id,
      label: "",
      value: "",
      type: 'link',
      svg: ""
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
          disabled: toggle ? true : false,
        }}
      >
        <Modal.Section>
          <TextContainer>
            <FormLayout>
              <TextField label="Link Label"
                name='label'
                value={state.label}
                onChange={(val) => ChangeHendle(val, 'label')}
                autoComplete="off" />
              <TextField label="Link"
                name='value'
                value={state.value}
                onChange={(val) => ChangeHendle(val, 'value')}
                autoComplete="off"
                placeholder='https://' />
            </FormLayout>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  )
}
