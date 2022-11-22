import { Button, ButtonGroup, Card, FormLayout, Layout, Page, ContextualSaveBar,Toast, ResourceList, TextField, TextStyle, RangeSlider, Frame } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Toggle from '../Toggle'
import { useAuthenticatedFetch } from "../../hooks";
import PopoverSetting from './Popover'
import SkeletonExample from '../SkeletonExample';
export default function Setting(){
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const [setting, setSetting] = useState({});  
  const [progress, setProgress] = useState(true);
  const [save, setSave] = useState(false);  
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const dataCard = [
    { heading: "Translations", value: "Add translations to use Customer Dashboard in any language.", content: "Manage Translations", link: "/translations" },
    { heading: "Plan", value: "Basic-Free", content: "Upgrade Plan", link: "/plan" },
  ]
  const need = [
    { heading: "Need Help", value: "", content: "Go To Support" },
  ]

  const hendlChange = (e) =>{
    setting.app_access_toggle=e.app_access_toggle;
    setSave(true);
    }

  const selectChange = (value, name) => {
    if(value)setSave(true);
    setSetting({
      ...setting,
      [name]: value});
  }


  const suffixStyles = {
    minWidth: '24px',
    textAlign: 'right',
  };


  useEffect(() => {
    getSetting();
  }, [])
  
  const toastMarkup = active ? (
    <Toast content="Data Saved" onDismiss={toggleActive} />
  ) : null;
  
      const contextualSaveBarMarkup = save ? (
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            onAction:()=>submit(),
          }}
          discardAction={{
            onAction:()=>setSave(false),
          }}
        />
      ) : null;  

      const getSetting = async () => {
        const getSetting = await fetch("/api/get-setting");
        const content = await getSetting.json();
        setSetting(content);
        setProgress(false);
      }
      
      const handleColorSetting = (e) =>{
            if(e)setSave(true);
            else setSave(false);
             var obj = Object.assign(setting, e);
             setSetting(obj);
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

  return (
 <Frame>
  {
    progress?
    <SkeletonExample/>:
    <>
    <Page title='Setting'
      breadcrumbs={[{ content: 'Products', onAction: () => navigate(-1) }]} />
    <Toggle content="Customers Dashboard Is" name="app_access_toggle" value={setting.app_access_toggle} hendleChange={hendlChange} />
    <Page>
      {contextualSaveBarMarkup}
      <Layout>
        { 
          dataCard.map((ele, index) => (
            <Layout.AnnotatedSection
              title={ele.heading} key={index}>
              <Card sectioned>
                <FormLayout>
                  {ele.value ? <p>{ele.value}</p> : ""}
                  <ButtonGroup>
                    {ele.link ? <Link className='link' to={ele.link}><Button>{ele.content ? ele.content : ""}</Button></Link> : <Button>{ele.content ? ele.content : ""}</Button>}
                  </ButtonGroup>
                </FormLayout>

              </Card>
            </Layout.AnnotatedSection>
          ))
        }
      </Layout>
    </Page>
    <Page title='Typography And Color'>
      <Layout>
        <Layout.Section oneHalf>
          <Card title="Sidebar">
            <Card.Section title="Font :">
              <FormLayout>
                <RangeSlider
                label="Menu Size"
                value={setting.sidebar_menu_size}
                name="sidebar_menu_size"
                min={10}
                max={60}
                onChange={(e) => selectChange(e, 'sidebar_menu_size')}
                suffix={<p style={suffixStyles}>{setting.sidebar_menu_size}px</p>}
                output
                />
                <RangeSlider
                label="Heading Size"
                name="sidebar_heading_size"
                value={setting.sidebar_heading_size}
                min={10}
                max={60}
                onChange={(e) => selectChange(e, 'sidebar_heading_size')}
                suffix={<p style={suffixStyles}>{setting.sidebar_heading_size}px</p>}
                output
                />                
              </FormLayout>

            </Card.Section>
            <Card.Section>
              <ResourceList
                resourceName={{ singular: 'product', plural: 'products' }}
                items={[
                  // {
                  //   id: 0,
                  //   name: 'Border',
                  //   sku: setting.sidebar_border,
                  //   media: (
                  //     <PopoverSetting cd_title="sidebar_border"  ColorChange = {handleColorSetting} value={setting.sidebar_border}/>
                  //   ),
                  // },
                  {
                    id: 1,
                    name: 'Background',
                    sku:setting.sidebar_background,
                    media: (<PopoverSetting cd_title="sidebar_background"  ColorChange = {handleColorSetting} value={setting.sidebar_background}/>
                    ),
                  }, {
                    id: 2,
                    name: 'Customer Name',
                    sku: setting.sidebar_customer_name,
                    media: (
                      <PopoverSetting cd_title="sidebar_customer_name"  ColorChange = {handleColorSetting} value={setting.sidebar_customer_name}/>
                    ),
                  }, {
                    id: 3,
                    name: 'Menu Background',
                    sku: setting.sidebar_menu_background,
                    media: (
                      <PopoverSetting cd_title="sidebar_menu_background"  ColorChange = {handleColorSetting} value={setting.sidebar_menu_background}/>
                    ),
                  }, {
                    id: 4,
                    name: 'Menu Text',
                    sku: setting.sidebar_menu_text,
                    media: (
                      <PopoverSetting cd_title="sidebar_menu_text"  ColorChange = {handleColorSetting} value={setting.sidebar_menu_text}/>
                    ),
                  }, {
                    id: 5,
                    name: 'Menu Active',
                    sku: setting.sidebar_menu_active,
                    media: (
                      <PopoverSetting cd_title="sidebar_menu_active"  ColorChange = {handleColorSetting} value={setting.sidebar_menu_active}/>
                    ),
                  },
                  {
                    id: 6,
                    name: 'Menu Text Hover',
                    sku: setting.sidebar_menu_text_hover,
                    media: (
                      <PopoverSetting cd_title="sidebar_menu_text_hover"  ColorChange = {handleColorSetting} value={setting.sidebar_menu_text_hover}/>
                    ),
                  },
                  // {
                  //   id: 7,
                  //   name: 'Icon',
                  //   sku: setting.sidebar_icon,
                  //   media: (
                  //     <PopoverSetting cd_title="sidebar_icon"  ColorChange = {handleColorSetting} value={setting.sidebar_icon}/>
                  //   ),
                  // },
                ]}
                renderItem={(item) => {
                  const { id, name, sku, media } = item;

                  return (
                    <ResourceList.Item
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${name}`}
                    >
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>
                      <div>{sku}</div>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card title="Main Content">
            <Card.Section title="Font :">
              <FormLayout>
              <RangeSlider
                label="Text Size"
                value={setting.main_content_text_size}
                name="main_content_text_size"
                min={10}
                max={60}
                onChange={(e) => selectChange(e, 'main_content_text_size')}
                suffix={<p style={suffixStyles}>{setting.main_content_text_size}px</p>}
                output
                />
                <RangeSlider
                label="Heading Size"
                name="main_content_heading_size"
                value={setting.main_content_heading_size}
                min={10}
                max={60}
                onChange={(e) => selectChange(e, 'main_content_heading_size')}
                suffix={<p style={suffixStyles}>{setting.main_content_heading_size}px</p>}
                output
                />               
                {/* <Select
                  label="Font-Family"
                  options={options}
                /> */}
              </FormLayout>

            </Card.Section>
            <Card.Section>
              <ResourceList
                resourceName={{ singular: 'product', plural: 'products' }}
                items={[
                  {
                    id: 0,
                    name: 'Primary',
                    sku: setting.main_content_primary,
                    media: (
                      <PopoverSetting cd_title="main_content_primary"  ColorChange = {handleColorSetting} value={setting.main_content_primary}/>
                    ),
                  }, {
                    id: 1,
                    name: 'Background',
                    sku: setting.main_content_background,
                    media: (
                      <PopoverSetting cd_title="main_content_background"  ColorChange = {handleColorSetting} value={setting.main_content_background}/>
                    ),
                  }, {
                    id: 2,
                    name: 'Foreground',
                    sku: setting.main_content_foreground,
                    media: (
                      <PopoverSetting cd_title="main_content_foreground"  ColorChange = {handleColorSetting} value={setting.main_content_foreground}/>
                    ),
                  }, {
                    id: 4,
                    name: 'Foreground Text',
                    sku: setting.main_content_foreground_text,
                    media: (
                      <PopoverSetting cd_title="main_content_foreground_text"  ColorChange = {handleColorSetting} value={setting.main_content_foreground_text}/>
                    ),
                  },
                  // {
                  //   id: 5,
                  //   name: 'Border',
                  //   sku: setting.main_content_border,
                  //   media: (
                  //     <PopoverSetting cd_title="main_content_border"  ColorChange = {handleColorSetting} value={setting.main_content_border}/>
                  //   ),
                  // }, 
                  {
                    id: 5,
                    name: 'Text',
                    sku: setting.main_content_text,
                    media: (
                      <PopoverSetting cd_title="main_content_text"  ColorChange = {handleColorSetting} value={setting.main_content_text}/>
                    ),
                  }, {
                    id: 6,
                    name: 'Heading',
                    sku: setting.main_content_heading,
                    media: (
                      <PopoverSetting cd_title="main_content_heading"  ColorChange = {handleColorSetting} value={setting.main_content_heading}/>
                    ),
                  },
                  // {
                  //   id: 7,
                  //   name: 'Order Item Background',
                  //   sku: setting.main_content_order_item_back,
                  //   media: (
                  //     <PopoverSetting cd_title="main_content_order_item_back"  ColorChange = {handleColorSetting} value={setting.main_content_order_item_back}/>
                  //   ),
                  // },
                  //  {
                  //   id: 9,
                  //   name: 'Reorder Text',
                  //   sku: setting.main_content_reorder_text,
                  //   media: (
                  //     <PopoverSetting cd_title="main_content_reorder_text"  ColorChange = {handleColorSetting} value={setting.main_content_reorder_text}/>
                  //   ),
                  // },
                ]}
                renderItem={(item) => {
                  const { id, name, sku, media } = item;

                  return (
                    <ResourceList.Item
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${name}`}
                    >
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>
                      <div>{sku}</div>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
    <Page title='Custom Css'>
      <Card>
        <Card.Section>
          <TextField
            placeholder='.style{...}'
            multiline={8}
            autoComplete="off"
            value={setting.custom_css}
            name="custom_css"
            onChange={(e) => selectChange(e, 'custom_css')}
          />
        </Card.Section>
      </Card>
    </Page>
    <Page>
      <Layout>
        {
          need.map((ele, index) => (
            <Layout.AnnotatedSection
              title={ele.heading} key={index}>
              <Card sectioned>
                <FormLayout>
                  {ele.value ? <p>{ele.value}</p> : ""}
                  <ButtonGroup>
                    <Button>{ele.content ? ele.content : ""}</Button>
                  </ButtonGroup>
                </FormLayout>

              </Card>
            </Layout.AnnotatedSection>
          ))
        }
      </Layout>
      {toastMarkup}
    </Page>
  </>
  }
 </Frame>
  )
}
