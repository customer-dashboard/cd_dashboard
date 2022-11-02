import { Page, Layout, Card } from '@shopify/polaris'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileReorder } from '../ProfileSetup/ProfileReorder'
import { CustomeLinkPage } from './customeLinkModel'
import { CustomePageModel } from './CustomePageModel'

const MenuBuilder = () => {
  const navigate = useNavigate();
  const [defaultProfile, setDefaultProfile] = useState([
    {
      id: 0,
      label: "Change Password",
      value: "",
      svg: 4,
      type: ""
    },
    {
      id: 1,
      label: "Addresses",
      value: "",
      svg: 3,
      type: ""
    },
    {
      id: 2,
      label: "Orders",
      value: "",
      svg: 2,
      type: ""
    },
    {
      id: 3,
      label: "My Profile",
      value: "",
      svg: 1,
      type: ""
    }
  ]);

  useEffect(() => {
    getProfileData();
  }, [])


  const getProfileData = () => {
    axios.get(`/api/get-menu_builder?shop=${Shop_name}`).then((response) => {
      const res = JSON.parse(response.data[0].fields);
      setDefaultProfile(res);
      console.log(res);
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

export default MenuBuilder