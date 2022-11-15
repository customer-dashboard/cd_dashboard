import { Page, Card, Form, Select, TextContainer, RadioButton } from '@shopify/polaris'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TranslationsFields from './TranslationsFields';
export default function Translations(){
  const navigate = useNavigate();
  const [local, setLocal] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    GetTranslations();
  }, [])

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

  console.log(selected);
  const options2 = [{ label: "Select Language", value: "" }];
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
                {local.map((ele, index) => (
                  <div key={index}>
                    <Card.Section title={ele.name} actions={[{ content: "Manage Translations", onAction:()=>handleSelectChange("language",ele.locale)}]}></Card.Section>
                  </div>))}
              </Card>
            </TextContainer>
          </Page>
          :
          <TranslationsFields value={selected} back={setToggle} />
      }
    </>
  )
}
