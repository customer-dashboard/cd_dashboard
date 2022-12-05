import { Page, Layout, Card, Frame, Toast } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileReorder from '../ProfileSetup/ProfileReorder'
import SkeletonExample from '../SkeletonExample'
import CustomeLinkPage from './customeLinkModel'
import { useAuthenticatedFetch } from "../../hooks";
import CustomePageModel from './CustomePageModel'

export default function MenuBuilder(){
  const navigate = useNavigate();
  const [defaultProfile, setDefaultProfile] = useState([]);
  const [defaultsvg, setdefaultsvg] = useState([]);
  const fetch = useAuthenticatedFetch();
  const [active, setActive] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(true);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const [progress, setProgress] = useState(true)

  useEffect(() => {
    if(activeConfirm===false){
      setActive(<Toast content="New Field Created" onDismiss={toggleActive} />);
      setActiveConfirm(true);
    }
    getProfileData();
    getSvgIcon();
  }, [activeConfirm])


  const getProfileData = async() => {
    const res = await fetch(`/api/get-menu_builder`);
    const content = await res.json();
    if(content.status===200){
      const response = JSON.parse(content.data[0].value);
      setDefaultProfile(response);
      setProgress(false);
    }
  }
  
  const getSvgIcon = async() =>{
    const res = await fetch(`/api/get-svg`);
    const content = await res.json();
    if(content.status)
    setdefaultsvg(JSON.parse(content.data[0].value));
  }

  return (
 <Frame>
  {
    progress?
    <SkeletonExample/>:
    <>
    <Page title='Menu Builder' breadcrumbs={[{ content: 'Menu', onAction: () => navigate(-1) }]}>
      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section>
              <ProfileReorder value={defaultProfile} result={getProfileData} table='menu_builder_fields' status='menu_default' defaultsvg={defaultsvg} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
    <Page>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <CustomePageModel defaultProfile={defaultProfile} getProfileData={getProfileData} activeConfirm={setActiveConfirm}/>
        <CustomeLinkPage defaultProfile={defaultProfile} getProfileData={getProfileData} activeConfirm={setActiveConfirm}/>
      </div>
      {active}
    </Page>
  </>
  }
 </Frame>
  )
}
