import { Page,Card,Form} from '@shopify/polaris'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ThemesModel } from './themesModel';
import { TranslationsFields } from './TranslationsFields';
const Translations = () => {
const navigate = useNavigate();
const [state, setState] = useState([])
const [local, setLocal] = useState([]);
const [themes, setThemes] = useState([]);
const [toggle, setToggle] = useState(false);

useEffect(() => {
    GetTranslations();
    getTheme();
  }, [])

  const getTheme = () => {
    axios.get(`/api/get-main-theme?shop=${Shop_name}`).then((response) => {
      setThemes(response.data);
    })
}

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

const handleSubmit = () =>{
    const data = {
     singleFields:state,
     multipleFields:group
    }
     axios.post(`/update-settings-all?shop=${Shop_name}`,data).then((response) => {
     if(response.status===200){
       console.log(response.data);
     }
     })
   }

    const navigation = [
        {heading:"My Profile",value:"My Profile", name:"my_profile"},
        {heading:"Orders",value:"Orders", name:"orders"},
        {heading:"Address",value:"Address", name:"address"},
        {heading:"Privacy Policy",value:"Privacy Policy", name:"privacy_policy"},
        {heading:"Return Policy",value:"Return Policy", name:"return_policy"},
    ]  
  return (
   <>
{
  !toggle?
  <Page title='Languages' 
  breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}
  primaryAction={<ThemesModel themes={themes}/>}
  >
<Form>
<Card>
{local.map((ele,index)=>(
<div key={index}>
<Card.Section title={ele.name} actions={[{ content: "Manage Translations",onAction:()=>{setState(ele);setToggle(true);}}]}></Card.Section>
</div>))}
</Card>
  </Form>
 </Page>
 :
  <TranslationsFields value={state} back={setToggle}/>
}
   </>
   )
}

export default Translations