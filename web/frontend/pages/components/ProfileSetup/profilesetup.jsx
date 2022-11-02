import { ContextualSaveBar, Card, Layout, Page, Toast } from '@shopify/polaris'
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Toggle } from '../Toggle';
import { AddFieldsModel } from './AddFieldsModel';
import { ProfileReorder } from './ProfileReorder';
import setting_json from "../Setting/json/setting.json";


const ProfileSetup = () => {
  const navigate = useNavigate();
  const [setting, setSetting] = useState(setting_json);
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const [defaultProfile, setDefaultProfile] = useState([]);

  useEffect(() => {
    getProfileData();
    getSetting();
  }, [])


  const toastMarkup = active ? (
    <Toast content="Data Saved" onDismiss={toggleActive} />
  ) : null;

  const contextualSaveBarMarkup = save ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
        onAction: () => submit(),
      }}
      discardAction={{
        onAction: () => setSave(false),
      }}
    />
  ) : null;

  const hendlChange = (e) => {
    setting.updatebycustomer_toggle = e.updatebycustomer_toggle;
    setSave(true);
  }

  function removeLineBreak(str){
    return str.replaceAll(/""/gm,'"');
}

  const getSetting = () => {
    axios.get(`/api/get-setting?shop=${Shop_name}`).then((response) => {
      var res = response.data[0].setting
      res = JSON.parse(removeLineBreak(res))
    setSetting(res);
    console.log(res);
})
  }

  const submit = () => {
    setting.custom_css=JSON.stringify(setting.custom_css);
    axios.post(`/api/set-setting?shop=${Shop_name}`, setting).then((response) => {
      if (response.status === 200) {
        setActive(true);
        setSave(false);
        getSetting();
      }
    })
  }

  const getProfileData = () => {
    axios.get(`/api/get-profile-fields?shop=${Shop_name}`).then((response) => {
      const res = JSON.parse(response.data[0].fields);
      setDefaultProfile(res);
      
    });
  }

  const AdditionalFields = (e) => {
    var id = defaultProfile.length;
    e.id=id.toString();
   e.name=e.label.toLowerCase().replaceAll(' ', '_')+'_'+e.id;
    defaultProfile.push(e);
    axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=profile_fields`, defaultProfile).then(() => {
      getProfileData();
    });
  }
  return (
    <>
      <Page title='Profile Setup'
        breadcrumbs={[{ content: 'Products', onAction: () => navigate(-1) }]}
        secondaryActions={<AddFieldsModel getAdditionalData={AdditionalFields} />}>
        {contextualSaveBarMarkup}
        <Layout>
          <Layout.Section oneHalf>
            <Card title="Profile Fields">
              <Card.Section>
                <ProfileReorder value={defaultProfile} result={getProfileData} table='profile_fields' status='default' />
              </Card.Section>

            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      <Page>
        <Toggle content="Allows your customers to update their marketing preference from within their customer account profiles." name="updatebycustomer_toggle" value={setting.updatebycustomer_toggle} hendleChange={hendlChange} />
        {toastMarkup}
      </Page>
    </>
  )
}

export default ProfileSetup