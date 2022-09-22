import { useCallback, useEffect, useState } from 'react'
import { Page,Card,Layout,TextField, Toast, Form} from '@shopify/polaris'
import axios from 'axios';
import jsonLocals from "./TranslateJson/en.json";
export const TranslationsFields = (props) => {
const [active, setActive] = useState(false);
const [state, setState] = useState(jsonLocals['en']);
const [themeId, setThemeId] = useState('')
const {value,back} = props;
useEffect(() => {
  getThemeId();
  getJson();
  }, [])

  const toggleActive = useCallback(() => setActive((active2) => !active2), []);

  const getJson = () => {
    axios.get(`/api/get-json?shop=${Shop_name}&locale=${value.locale}`).then((response) => {
     if(response.status===200){
      const data = [];
      const array = JSON.parse(response.data[0].value);
      var size = Object.keys(array).length;
      for (let index = 0; index<size; index++) {
        data.push(array[index]);
      }
      setState(data);
     }
    })
}

const getThemeId = () => {
  axios.get(`/api/get-theme-id?shop=${Shop_name}`).then((response) => {
    if(response.status===200)setThemeId(response.data[0].theme_id);
  })
}


  const hendleChangeUpdate = (value,name,index) =>{
    setState((preValue)=>{
      let newFormValues = [...preValue];
      newFormValues[index][name] = value;
      return newFormValues;
    })
   }
   const toastMarkup = active ? (
    <Toast content='save' onDismiss={toggleActive} />
  ) : null;


const handleChange = ()=>{
const array = state;
const id = parseInt(themeId)
var rv = {};
for (var i = 0; i < array.length; ++i)
if (array[i] !== undefined) rv[i] = array[i];
const data = {
  value:rv,
  locale:value.locale
}
  axios.post(`/api/create-jsonfile?id=${id}&shop=${Shop_name}`,data).then((response) => {
    console.log(response);
  })
}

  return (
   <Page title={value.name} 
    breadcrumbs={[{content: 'Products',onAction:()=>back(false)}]}
    primaryAction={{
      content:"Save",
      onAction:handleChange
    }}
    >
 <Form>
<Card title="Navigation">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='Navigation'){
          return(
            <Layout.AnnotatedSection
            title={local.heading} key={index}>
            <Card sectioned>
            <TextField
            name="value"
            type="text"                          
            value={local.value}
            onChange = {(e)=>hendleChangeUpdate(e,'value',index)}                                                
            />  
            </Card>
            </Layout.AnnotatedSection>
          )
        }
      })
  }
    </Layout>
</Card.Section>
</Card>

<Card title="My Profile">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='My Profile'){
          return(
            <Layout.AnnotatedSection
            title={local.heading} key={index}>
            <Card sectioned>
            <TextField
            name="value"
            type="text"                          
            value={local.value}
            onChange = {(e)=>hendleChangeUpdate(e,'value',index)}                                                
            />  
            </Card>
            </Layout.AnnotatedSection>
          )
        }
      })
  }
    </Layout>
</Card.Section>
</Card>

<Card title="Addresses">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='Addresses'){
          return(
            <Layout.AnnotatedSection
            title={local.heading} key={index}>
            <Card sectioned>
            <TextField
            name="value"
            type="text"                          
            value={local.value}
            onChange = {(e)=>hendleChangeUpdate(e,'value',index)}                                                
            />  
            </Card>
            </Layout.AnnotatedSection>
          )
        }
      })
  }
    </Layout>
</Card.Section>
</Card>

<Card title="Change Password">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='Change Password'){
          return(
            <Layout.AnnotatedSection
            title={local.heading} key={index}>
            <Card sectioned>
            <TextField
            name="value"
            type="text"                          
            value={local.value}
            onChange = {(e)=>hendleChangeUpdate(e,'value',index)}                                                
            />  
            </Card>
            </Layout.AnnotatedSection>
          )
        }
      })
  }
    </Layout>
</Card.Section>
</Card>

<Card title="Orders">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='Orders'){
          return(
            <Layout.AnnotatedSection
            title={local.heading} key={index}>
            <Card sectioned>
            <TextField
            name="value"
            type="text"                          
            value={local.value}
            onChange = {(e)=>hendleChangeUpdate(e,'value',index)}                                                
            />  
            </Card>
            </Layout.AnnotatedSection>
          )
        }
      })
  }
    </Layout>
</Card.Section>
</Card>

<Card title="Shared">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='Shared'){
          return(
            <Layout.AnnotatedSection
            title={local.heading} key={index}>
            <Card sectioned>
            <TextField
            name="value"
            type="text"                          
            value={local.value}
            onChange = {(e)=>hendleChangeUpdate(e,'value',index)}                                                
            />  
            </Card>
            </Layout.AnnotatedSection>
          )
        }
      })
  }
    </Layout>
</Card.Section>
</Card>
         {toastMarkup}
        </Form>
   </Page>
   )
}
