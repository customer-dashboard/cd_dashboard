import { Page, Card, Form, Select, TextContainer } from '@shopify/polaris'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TranslationsFields } from './TranslationsFields';
const Translations = () => {
  const navigate = useNavigate();
  const [state, setState] = useState([])
  const [local, setLocal] = useState([]);
  const [themes, setThemes] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    getTheme();
    GetTranslations();
  }, [])

  const getTheme = () => {
    axios.get(`/api/get-main-theme?shop=${Shop_name}`).then((response) => {
      setThemes(response.data);
    })
  }



  const GetTranslations = () => {
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
  const handleSelectChange = (name, value) => {
    if (name === 'language') setToggle(true);
    else setToggle(false);
    setSelected((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    });
  };
  const options = [{label:"Select Theme", value:""}];
  themes.map((ele, index) => (options.push({ key: index, label: ele.name, value: ele.id.toString() })))
  const options2 = [{label:"Select Language", value:""}];
  local.map((ele, index) => (options2.push({ key: index, label: ele.name, value: ele.locale })));
  return (
    <>
      {
        !toggle ?
          <Page title='Languages'
            breadcrumbs={[{ content: 'Products', onAction: () => navigate(-1) }]}
          >
            <TextContainer >
              <Card>
                <Card.Section>
                  <Select
                    label="Select Theme"
                    options={options}
                    name="theme_id"
                    onChange={(e) => handleSelectChange('theme_id', e)}
                    value={selected.theme_id}
                  />

                {
                  selected.theme_id?
                  <Select
                    label="Select Language"
                    options={options2}
                    name="language"
                    onChange={(e) => handleSelectChange('language', e)}
                    value={selected.language}
                  />
                  :null
                }
                </Card.Section>
              </Card>
            </TextContainer>
          </Page>
          :
          <TranslationsFields value={selected} back={setToggle} />
      }
    </>
  )
}

export default Translations