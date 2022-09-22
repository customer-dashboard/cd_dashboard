import {Modal, TextContainer } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { useState } from 'react'
import axios from 'axios';


export const DeleteComponent = ({table,id,data}) => {
        const [active, setActive] = useState(false);
        const handleChange = () => setActive(!active);
        const activator = <span style={{width:"20px", float:"right",cursor:"pointer"}} onClick={handleChange}> <DeleteMinor/></span>;

    const deleteField = ()=>{
        axios.post(`/api/delete-data?id=${id}&shop=${Shop_name}&query=${table}`,).then((response) => {
         if(response.status===200){
          data();
          setActive(false)
         }
     });
     }

        return (      
              <>
              {activator}   
              <Modal
              open={active}
              onClose={handleChange}
              title="Are you sure want to delete?"
              primaryAction={{
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
