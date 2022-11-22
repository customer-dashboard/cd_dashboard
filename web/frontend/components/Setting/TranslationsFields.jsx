import {useAuthenticatedFetch } from "../../hooks";
import { useCallback, useEffect, useState } from 'react'
import { Page,Card,Layout,TextField, Toast, Form, Button, ContextualSaveBar, Spinner} from '@shopify/polaris'
import translation from ".././metafields/translation"
export default function TranslationsFields(props){
const [active, setActive] = useState(false);
const [loading, setLoading] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [state, setState] = useState(translation['en']);
const [save, setSave] = useState(false);  
const {value,back} = props;
useEffect(() => {
  getJson();
  }, [])
  const toggleActive = useCallback(() => setActive((active2) => !active2), []);
  const getJson = async () => {
    const res = await fetch(`/api/get-json?locale=${value.language}`);
    const content = await res.json();
    if(content){
      var arr = JSON.parse(content.value)[value.language];
      setState(arr);
    }
}


const handleChange = async()=>{
  setLoading(true);
  const array = state;
  const data = {
    value:{[value.language]:array},
    locale:value.language
  }
  const response = await fetch('/api/create-translations', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
const content = await response.json();
if (content.status === 200) {
  setActive(<Toast content='Data Saved' onDismiss={toggleActive} />);
  setLoading(false);
  setSave(false);
}
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
         {active}
        </Form>
   </Page>
   )
}
