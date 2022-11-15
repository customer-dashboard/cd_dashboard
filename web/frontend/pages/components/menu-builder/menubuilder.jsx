import { Page, Layout, Card } from '@shopify/polaris'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileReorder from '../ProfileSetup/ProfileReorder'
import CustomeLinkPage from './customeLinkModel'
import CustomePageModel from './CustomePageModel'

export default function MenuBuilder(){
  const navigate = useNavigate();
  const [defaultProfile, setDefaultProfile] = useState([]);

  useEffect(() => {
    getProfileData();
  }, [])


  const getProfileData = () => {
    axios.get(`/api/get-menu_builder?shop=${Shop_name}`).then((response) => {
      if (response.data!=="") {
        const res = JSON.parse(response.data.value);
      setDefaultProfile(res);
      }
    });
  }

  return (
    <>
      <Page title='Menu Builder' breadcrumbs={[{ content: 'Menu', onAction: () => navigate(-1) }]}>
        <Layout>
          <Layout.Section oneHalf>
            <Card>
              <Card.Section>
                <ProfileReorder value={defaultProfile} result={getProfileData} table='menu_builder_fields' status='menu_default' />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      <Page>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <CustomePageModel value={defaultProfile} getProfileData={getProfileData} />
          <CustomeLinkPage value={defaultProfile} getProfileData={getProfileData} />
        </div>
      </Page>
    </>
  )
}
