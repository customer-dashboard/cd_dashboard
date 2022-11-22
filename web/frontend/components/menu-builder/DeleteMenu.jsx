import {Modal, Spinner, TextContainer } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { useAuthenticatedFetch } from "../../hooks";
import { useEffect, useState } from 'react'
export default function DeleteMenu(props){
  const {value,getProfileData,id,table,type} = props;
const [loading, setLoading] = useState(false);
const [active, setActive] = useState(false);   
  const fetch = useAuthenticatedFetch();
  const [local, setLocal] = useState([]);
  const handleChange = () => setActive(!active);
  const activator = <span style={{width:"20px", float:"right",cursor:"pointer"}} onClick={handleChange}> <DeleteMinor/></span>;
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
  }

  
    const deleteField = ()=>{
      const data = value.filter(data => data.id != id);
      setLoading(true);
      local.forEach(async(element_2) => {
        const res = await fetch(`/api/get-json?locale=${element_2.locale}`);
        const content = await res.json();
        if(content){
          var arr = JSON.parse(content.value)[element_2.locale];
          const temp = arr.filter(obj1 => data.some(obj2 => obj2.label === obj1.heading&&obj1.name===type))
          for (var i = arr.length - 1; i >= 0; i--) {
          if (arr[i].name === type) { 
          arr.splice(i, 1);
          }
          }
          temp.forEach(element => {
          arr.push(element);
          });
          const data_local = {
            value:{[element_2.locale]:arr},
            locale:element_2.locale
          }
          
          await fetch('/api/create-translations', {
            method: 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(data_local)
          });
         const data_retrun = await fetch(`/api/post-reorder-fields?query=${table}`, {
            method: 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(data)
          });
          const content_return = data_retrun.json();
          if(content_return){
            getProfileData();
            handleChange();
            setLoading(false);
          }

        }});
     }

        return (      
              <>
              {activator}   
              <Modal
              open={active}
              onClose={handleChange}
              title="Are you sure to delete?"
              primaryAction={{
              loading:loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null,
              content: 'Delete',
              onAction: deleteField,
              destructive: true,
              }}
              secondaryActions={[
              {
              content: 'Cancel',
              onAction: handleChange,
              },
              ]}
              >
              <Modal.Section>
              <TextContainer>
              <p>
              Delete Field This can't be undone.
              </p>
              </TextContainer>
              </Modal.Section>
              </Modal>
              </>
        );
      
}
