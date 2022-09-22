import {Card, Layout, Page } from '@shopify/polaris'
import axios from 'axios';
import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Toggle } from '../Toggle';
import { AddFieldsModel } from './AddFieldsModel';
import {ProfileReorder} from './ProfileReorder';

const ProfileSetup = () => {
const navigate = useNavigate();
const [additional, setAdditional] = useState([]);
  const [defaultProfile, setDefaultProfile] = useState([
    {
      id: "1",
      title: "My Profile"
    },
    {
      id: "2",
      title: "Orders"
    },
    {
      id: "3",
      title: "Address"
    },
    {
      id: "4",
      title: "Phone"
    }
  ]);

  useEffect(() => {
    getAdditionalData();
    getProfileData();
  }, [])
  

  const getProfileData = ()=>{
      axios.get(`/api/get-data?shop=${Shop_name}&query=profile_default_fields`).then((response) => {
        const res = JSON.parse(response.data[0].fields);
        setDefaultProfile(res);
      });
    }

    const getAdditionalData = ()=>{
      axios.get(`/api/get-profile-additional-fields?shop=${Shop_name}&query=profile_additional_fields`).then((response) => {
        const res = (response.data);
        const result = [];
        res.map((ele,index)=>{
          result.push({key:ele.id, id:index,title:JSON.parse(ele.fields).singleFields.label});
        })
        setAdditional(result);
      });
    }

  return (
<> 
<Page title='Profile Setup'
 breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}
 primaryAction={<AddFieldsModel  getAdditionalData = {getAdditionalData}/>}>
   <Layout>
     <Layout.Section oneHalf>
       <Card title="Profile Default Fields">
         <Card.Section>
          <ProfileReorder value={defaultProfile} result={getProfileData} table='profile_default_fields' status ='default' />
         </Card.Section>
  
       </Card>
     </Layout.Section>
     <Layout.Section oneHalf>
       <Card title="Additional Fields">
         <Card.Section>
         <ProfileReorder value={additional} result={getAdditionalData} status ='additional'/>
         </Card.Section>
       </Card>
     </Layout.Section>
   </Layout>
 </Page>
 <Page>
<Toggle content="Allows your customers to update their marketing preference from within their customer account profiles." table='admin_setting'/>
 </Page>
</>
  )
}

export default ProfileSetup