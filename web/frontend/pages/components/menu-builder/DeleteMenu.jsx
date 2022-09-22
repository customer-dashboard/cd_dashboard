import {Modal, TextContainer } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { useState } from 'react'
import axios from 'axios';


export const DeleteMenu = (props) => {
  const Result = props.value;
  const getProfileData = props.getProfileData;
  const [active, setActive] = useState(false);
  const handleChange = () => setActive(!active);
  const activator = <span style={{width:"20px", float:"right",cursor:"pointer"}} onClick={handleChange}> <DeleteMinor/></span>;

    const deleteField = ()=>{
      const data = Result.filter(data => data.id != props.id);
         axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=menu_builder_fields`,data).then((response) => {
         console.log(response);
         getProfileData();
         handleChange();
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
