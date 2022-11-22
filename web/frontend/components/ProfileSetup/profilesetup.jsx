import { ContextualSaveBar, Card, Layout, Page, Toast, Spinner, Frame } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SkeletonExample from '../SkeletonExample';
import Toggle from '../Toggle';
import AddFieldsModel from './AddFieldsModel';
import { useAuthenticatedFetch } from "../../hooks";
import ProfileReorder from './ProfileReorder';


export default function ProfileSetup() {
  const navigate = useNavigate();
  const [setting, setSetting] = useState({});
  const [progress, setProgress] = useState(true)
  const [save, setSave] = useState(false);
  const fetch = useAuthenticatedFetch();
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

  const GetLocal = async() => {
    const query = `query MyQuery{
      shopLocales {
        locale
        name
        primary
        published
      }
    }`;
  
    const data = { query: query }
    const response = await fetch('/api/graphql-data-access', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  const content = await response.json();
  setLocal(content.body.data.shopLocales);
  }

  const toastMarkup = active ? (
    <Toast content="Data Saved" onDismiss={toggleActive} />
  ) : null;

  const contextualSaveBarMarkup = save ? (
    <ContextualSaveBar
      message={loading ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : null}
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


  const getSetting = async () => {
    const getSetting = await fetch("/api/get-setting");
    const content = await getSetting.json();
    setSetting(content);
  }

  const submit = async () => {
    const response = await fetch('/api/set-setting', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setting)
    });
  const content = await response.json();
  if (content.status === 200) {
    setActive(<Toast content={content.success} onDismiss={toggleActive} />);
    setSave(false);
    getSetting();
  }
    }
  const getProfileData = async () => {
    const getprofile = await fetch("/api/get-profile-fields");
    const content = await getprofile.json();
    if (content !== "") {
      const res = JSON.parse(content.value);
      setDefaultProfile(res);
      setProgress(false);
    }
  }


  function add(arr, name) {
    const found = arr.some(el => el.heading === name);
    if (!found) arr.push({ heading: name, value: name, name: "Shared" });
    return arr;
  }

  const AdditionalFields = (e) => {
    var id = defaultProfile.length;
    e.id = id.toString();
    e.name = e.label.toLowerCase().replaceAll(' ', '_') + '_' + e.id;
    defaultProfile.push(e);
    setLoading(true);
    local.forEach(async(element_2) => {
      const res = await fetch(`/api/get-json?locale=${element_2.locale}`);
      const content = await res.json();
      if (content) {
        var arr = JSON.parse(content.value)[element_2.locale];
        var array = [];
        defaultProfile.forEach(element => {
          array = add(arr, element.label);
        });
        const data = {
          value: { [element_2.locale]: array },
          locale: element_2.locale
        }

        const createTranslations =  await fetch('/api/create-translations', {
          method: 'POST',
          headers: {'Accept': 'application/json','Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        if(createTranslations.json()){
          const data_retrun = await fetch(`/api/post-reorder-fields?query=profile_fields`, {
            method: 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(defaultProfile)
          });
          const content_return = data_retrun.json();
          if(content_return){
            getProfileData();
            setLoading(false);
          }
        }
      }
    });
  }
  return (
    <Frame>
      {
        progress ?
          <SkeletonExample /> :
          <>
            <Page title='Profile Setup'
              breadcrumbs={[{ content: 'Products', onAction: () => navigate(-1) }]}
              secondaryActions={<AddFieldsModel getAdditionalData={AdditionalFields} />}>
              {contextualSaveBarMarkup}
              <Layout>
                <Layout.Section oneHalf>
                  <Card title="Profile Fields">
                    <Card.Section>
                      <ProfileReorder value={defaultProfile} result={getProfileData} table='profile_fields' status='default' defaultsvg=""/>
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
      }
    </Frame>
  )
}
