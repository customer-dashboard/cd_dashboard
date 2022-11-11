import {Modal, Spinner, TextContainer } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { useEffect, useState } from 'react'
import axios from 'axios';


export const DeleteMenu = (props) => {
  const {value,getProfileData,id,table,type} = props;
const [loading, setLoading] = useState(false);
const [active, setActive] = useState(false);   
   const [local, setLocal] = useState([]);
  const handleChange = () => setActive(!active);
  const activator = <span style={{width:"20px", float:"right",cursor:"pointer"}} onClick={handleChange}> <DeleteMinor/></span>;
  useEffect(() => {
    GetLocal();
  }, [])
  const GetLocal = () => {
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

  
    const deleteField = ()=>{
      const data = value.filter(data => data.id != id);
      setLoading(true);
      local.forEach(element_2 => {
        axios.get(`/api/get-json?shop=${Shop_name}&locale=${element_2.locale}`).then((response) => {
          if(response.data){
            var arr = JSON.parse(response.data.value)[element_2.locale];
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
            
          axios.post(`/api/create-translations?shop=${Shop_name}`,data_local).then(() => {
            axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=${table}`,data).then(() => {
              getProfileData();
              handleChange();
          setLoading(false);
              });
          })

          }});
      });

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
