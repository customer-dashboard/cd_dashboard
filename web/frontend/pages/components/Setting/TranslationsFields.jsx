import { useCallback, useEffect, useState } from 'react'
import { Page,Card,Layout,TextField, Toast, Form} from '@shopify/polaris'
import axios from 'axios';
export const TranslationsFields = (props) => {
const [active, setActive] = useState(false);
const [state, setState] = useState([]);
const {value,back} = props;
useEffect(() => {
  getJson();
  }, [])
  const toggleActive = useCallback(() => setActive((active2) => !active2), []);
console.log(value);
  const getJson = () => {
    axios.get(`/api/get-json?shop=${Shop_name}&theme_id=${parseInt(value.theme_id)}&locale=${value.language}`).then((response) => {
      var arr = response.data;
     axios.get(`/api/get-menu_builder?shop=${Shop_name}`).then((res) => {
      const res_1 = JSON.parse(res.data[0].fields);
     res_1.map((ele)=>{
      arr =[...arr,{heading: ele.label,value: ele.label,name: "Navigation"}] 
     });
     setState(arr);
    });
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
const id = parseInt(value.theme_id)
var rv = {};
for (var i = 0; i < array.length; ++i)
if (array[i] !== undefined) rv[i] = array[i];
const data = {
  value:rv,
  locale:value.language
}
  axios.post(`/api/create-jsonfile?id=${id}&shop=${Shop_name}`,data).then((response) => {
    getJson();
  })
}

  return (
   <Page title={value.language} 
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
