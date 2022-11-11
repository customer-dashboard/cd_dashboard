import { Button, Select, Modal, TextContainer, TextField, Card } from '@shopify/polaris'
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'

export const TranslationSetting = (props) => {
  const Result = props.value;
  const [toggle, setToggle] = useState(true);
  const [state, setState] = useState({
    type:"link"
  })
  const [local, setLocal] = useState([]);
  const [selected, setSelected] = useState({});

  const handleSelectChange=(name,value)=>{
    if(name==='language')setToggle(false);
    else setToggle(true);  
    setSelected({
    ...selected,
    [name]:value})
  };
  useEffect(() => {
    getTheme();
    GetTranslations();
  }, [])

  const GetTranslations=()=>{
    const query = `query MyQuery{
      shopLocales {
        locale
        name
        primary
        published
      }
    }`;

    const data={query:query}
    axios.post(`/api/graphql-data-access?shop=${Shop_name}`,data).then((response) => {
      setLocal(response.data.body.data.shopLocales);
     });
 }

    const [active, setActive] = useState(false);
    const handleChange = useCallback(() => {Clear();setActive(!active), [active]});
    const activator = <Button onClick={handleChange}>{Result}</Button>;
    const [themes, setThemes] = useState([]);
    const getTheme = () => {
      axios.get(`/api/get-main-theme?shop=${Shop_name}`).then((response) => {
        setThemes(response.data);
      })
  }
  const options = themes.map((ele,index)=>{
    return {key:index,label:ele.name, value:ele.id};
      })
  const options2 = local.map((ele,index)=>{
  return {key:index,label:ele.name, value:ele.local};
    })
  const Clear = () =>{
    setState({
      type:"link"
    });
  }

  const uplaodData = ()=>{
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
              onAction:uplaodData,
              disabled: toggle?true:false,
            }}
          >
            <Modal.Section>
              <TextContainer>
              <Card>
                <Card.Section>
                <Select
              label="Select Theme"
              options={options}
              name="theme_id"
              onChange={(e)=>handleSelectChange('theme_id',e)}
              value={selected.theme_id}
              />

              <Select
              label="Select Language"
              options={options2}
              name="language"
              onChange={(e)=>handleSelectChange('language',e)}
              value={selected.language}
              />
                </Card.Section>
              </Card>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>   
  )
}
