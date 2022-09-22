import { Page,Layout,Card } from '@shopify/polaris'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {ProfileReorder} from '../ProfileSetup/ProfileReorder'
import { CustomeLinkPage } from './customeLinkModel'
import { CustomePageModel } from './CustomePageModel'

const MenuBuilder = () => {
const navigate = useNavigate();
  const [defaultProfile, setDefaultProfile] = useState([
    {
      id: 1,
      title: "My Profile"
    },
    {
      id: 2,
      title: "Orders"
    },
    {
      id: 3,
      title: "Address"
    },
    {
      id: 4,
      title: "Phone"
    }
  ]);

  useEffect(() => {
    getProfileData();
  },[])
  

  const getProfileData = ()=>{
      axios.get(`/api/get-data?shop=${Shop_name}&query=menu_builder_fields`).then((response) => {
        const res = JSON.parse(response.data[0].fields);
        setDefaultProfile(res);
      });
    }

  return (
  <>
<Page title='Menu Builder' breadcrumbs={[{content: 'Menu',onAction:()=>navigate(-1)}]}>
    <Layout>
      <Layout.Section oneHalf>
        <Card>
         <Card.Section>
          <ProfileReorder value={defaultProfile} result={getProfileData} table='menu_builder_fields' status ='default' />
         </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
<Page>
<div style={{display:"flex",justifyContent:"space-between"}}>
<CustomePageModel value={defaultProfile} getProfileData={getProfileData}/>
<CustomeLinkPage value={defaultProfile} getProfileData={getProfileData}/>
</div>
</Page>
</>
  )
}

export default MenuBuilder