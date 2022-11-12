import { ContextualSaveBar, Card, Layout, Page, Toast, Spinner } from '@shopify/polaris'
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Toggle } from '../Toggle';
import { AddFieldsModel } from './AddFieldsModel';
import { ProfileReorder } from './ProfileReorder';


const ProfileSetup = () => {
  const navigate = useNavigate();
  const [setting, setSetting] = useState({});
  const [save, setSave] = useState(false);
const [loading, setLoading] = useState(false);
const [local, setLocal] = useState([]);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const [defaultProfile, setDefaultProfile] = useState([]);

  useEffect(() => {
    getProfileData();
    getSetting();
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

  const toastMarkup = active ? (
    <Toast content="Data Saved" onDismiss={toggleActive} />
  ) : null;

  const contextualSaveBarMarkup = save ? (
    <ContextualSaveBar
      message={loading?<Spinner accessibilityLabel="Small spinner example" size="small" />:null}
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


  const getSetting = () => {
    axios.get(`/api/get-setting?shop=${Shop_name}`).then((response) => {
      if (response.data!=="") {
        setSetting(response.data);
      }
})
  }

  const submit = () => {
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
      if (response.data!=="") {
        const res = JSON.parse(response.data.value);
        setDefaultProfile(res);
      }
    });
  }

  function add(arr, name) {
    const found = arr.some(el => el.heading === name);
    if (!found) arr.push({heading: name,value: name,name: "Shared"});
    return arr;
  }

  const AdditionalFields = (e) => {
    var id = defaultProfile.length;
    e.id=id.toString();
    e.name=e.label.toLowerCase().replaceAll(' ', '_')+'_'+e.id;
    defaultProfile.push(e);
  setLoading(true);
    local.forEach(element_2 => {
      axios.get(`/api/get-json?shop=${Shop_name}&locale=${element_2.locale}`).then((response) => {
          if(response.data){
            var arr = JSON.parse(response.data.value)[element_2.locale];
            var array = [];
            defaultProfile.forEach(element => {
              array=add(arr, element.label);
            });
            const data = {
              value:{[element_2.locale]:array},
              locale:element_2.locale
            }
          axios.post(`/api/create-translations?shop=${Shop_name}`,data).then(() => {
            axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=profile_fields`, defaultProfile).then(() => {
              getProfileData();
               setLoading(false);
            });
          })
          }
        });
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