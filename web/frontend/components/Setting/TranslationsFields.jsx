import {useAuthenticatedFetch } from "../../hooks";
import { useCallback, useEffect, useState } from 'react'
import { Page,Card,Layout,TextField, Toast, Form, ContextualSaveBar, Spinner} from '@shopify/polaris'
import SkeletonExample from "../SkeletonExample";
export default function TranslationsFields(props){
const [active, setActive] = useState(false);
const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(true);
  const fetch = useAuthenticatedFetch();
  const [state, setState] = useState([]);
const [save, setSave] = useState(false);  
const {value,back} = props;
useEffect(() => {
  getJson();
  }, [])
  const toggleActive = useCallback(() => setActive((active2) => !active2), []);
  const getJson = async () => {
    const localjson = await fetch(`/api/get-json?locale=en`);
    const contentlocaljson = await localjson.json();
    var arr = JSON.parse(contentlocaljson.data[0].value)["en"];
    const res = await fetch(`/api/get-json?locale=${value.language}`);
    const content = await res.json();
    if(content.status===200&&content.data[0]?.value){
    arr = JSON.parse(content.data[0].value)[value.language];
    }
    setState(arr);
    setProgress(false);
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
if (content.status === 200)setActive(<Toast content={content.data} onDismiss={toggleActive} />);
else if(content.status===500)
setActive(<Toast content={content.error} error onDismiss={toggleActive} />);
setLoading(false);
setSave(false);
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
      saveAction={{
        loading:loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null,
        onAction:()=>handleChange()}}
      discardAction={{onAction:()=>setSave(false)}}
    />
  ) : null;

  return (
<>
{
  progress?
  <SkeletonExample/>:
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
}</>
   )
}
