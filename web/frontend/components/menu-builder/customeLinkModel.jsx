import { Button, FormLayout, Modal, Page, Select, Spinner, TextContainer, TextField } from '@shopify/polaris'
import { useAuthenticatedFetch } from "../../hooks";
import { useCallback, useEffect, useState } from 'react'
export default function CustomeLinkPage(props){
  const {defaultProfile,getProfileData,activeConfirm} = props;
  const id = defaultProfile.length;
const [loading, setLoading] = useState(false);
const [local, setLocal] = useState([]);
  const fetch = useAuthenticatedFetch();
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
  if(content.status===200){
    setLocal(content.data.body.data.shopLocales);
  }
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
    defaultProfile.push(state);
    setLoading(true);
    local.forEach(async(element_2) => {
    const res = await fetch(`/api/get-json?locale=${element_2.locale}`);
    const content = await res.json();
    if(content.status===200){
          var arr = JSON.parse(content.data[0].value)[element_2.locale];
          var array = [];
          defaultProfile.forEach(element => {
            array=add(arr, element.label);
          });
          const data = {
            value:{[element_2.locale]:array},
            locale:element_2.locale
          }
          
          const createTranslations =  await fetch('/api/create-translations', {
            method: 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(data)
          });
          const response = await createTranslations.json();
          if(response.status===200){
            const data_retrun = await fetch(`/api/post-reorder-fields?query=menu_builder_fields`, {
              method: 'POST',
              headers: {'Accept': 'application/json','Content-Type': 'application/json'},
              body: JSON.stringify(defaultProfile)
            });
            const content_return = await data_retrun.json();
            if(content_return.status===200){
              getProfileData();
              handleChange();
              setLoading(false);
              activeConfirm(false);
            }
          }
        }
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
