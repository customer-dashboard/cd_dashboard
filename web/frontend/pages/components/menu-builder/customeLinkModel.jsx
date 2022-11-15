import { Button, FormLayout, Modal, Page, Select, Spinner, TextContainer, TextField } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
export default function CustomeLinkPage(props){
  const Result = props.value;
  const id = Result.length;
const [loading, setLoading] = useState(false);
const [local, setLocal] = useState([]);
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

  function add(arr, name) {
    const found = arr.some(el => el.heading === name);
    if (!found) arr.push({heading: name,value: name,name: "Navigation"});
    return arr;
  }


  const Submit = () => {
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
          loading:loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null,
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
