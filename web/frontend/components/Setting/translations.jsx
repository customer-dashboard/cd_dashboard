import { Page, Card, TextContainer, Frame } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useAuthenticatedFetch } from "../../hooks";
import SkeletonExample from '../SkeletonExample';
import TranslationsFields from './TranslationsFields';
export default function Translations(){
  const navigate = useNavigate();
  const [progress, setProgress] = useState(true);
  const [local, setLocal] = useState([]);
  const fetch = useAuthenticatedFetch();
  const [toggle, setToggle] = useState(false);
  const [selected, setSelected] = useState({});

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
  setLocal(content.body.data.shopLocales);
  setProgress(false);
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

  const options2 = [{ label: "Select Language", value: "" }];
  local.map((ele, index) => (options2.push({ key: index, label: ele.name, value: ele.locale })));
  return (
<Frame>
  {
    progress?
    <SkeletonExample/>
    :
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
  }
</Frame>
  )
}
