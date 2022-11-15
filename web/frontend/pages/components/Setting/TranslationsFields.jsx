import { useCallback, useEffect, useState } from 'react'
import { Page,Card,Layout,TextField, Toast, Form, Button, ContextualSaveBar, Spinner} from '@shopify/polaris'
import translation from "../../../metafields/translation"
import axios from 'axios';
export default function TranslationsFields(props){
const [active, setActive] = useState(false);
const [loading, setLoading] = useState(false);
const [state, setState] = useState(translation['en']);
const [save, setSave] = useState(false);  
const {value,back} = props;
useEffect(() => {
  getJson();
  }, [])
  const toggleActive = useCallback(() => setActive((active2) => !active2), []);
  const getJson = () => {
    axios.get(`/api/get-json?shop=${Shop_name}&locale=${value.language}`).then((response) => {
      if(response.data){
        var arr = JSON.parse(response.data.value)[value.language];
        setState(arr);
      }
    })
}

const handleChange = ()=>{
  setLoading(true);
  const array = state;
  const data = {
    value:{[value.language]:array},
    locale:value.language
  }
  axios.post(`/api/create-translations?shop=${Shop_name}`,data).then((response) => {
  setActive(true);
  setLoading(false);
  setSave(false);
    })
  }

  const hendleChangeUpdate = (value,name,index) =>{
    if(value)setSave(true);
    else setSave(false);
    setState((preValue)=>{
      let newFormValues = [...preValue];
      newFormValues[index][name] = value;
      return newFormValues;
    })
   }
   const toastMarkup = active ? (
    <Toast content='Data Saved' onDismiss={toggleActive} />
  ) : null;

  const contextualSaveBarMarkup = save ? (
    <ContextualSaveBar
      message={loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null}
      saveAction={{onAction:()=>handleChange()}}
      discardAction={{onAction:()=>setSave(false)}}
    />
  ) : null;

  return (
   <Page title={value.language} 
    breadcrumbs={[{content: 'Products',onAction:()=>back(false)}]}>
  {contextualSaveBarMarkup}
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
<Card title="Button">
<Card.Section>
<Layout>
  {
      state.map((local,index)=>{
        if(local.name==='Button'){
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
