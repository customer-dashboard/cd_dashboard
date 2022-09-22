import { Button, ButtonGroup, Card, FormLayout, Layout, Page, Select,ResourceList,TextField,TextStyle} from '@shopify/polaris'
import { Link, useNavigate } from 'react-router-dom'
import { Toggle } from '../Toggle'
import { PopoverSetting } from './Popover'
const Setting = () => {
const navigate = useNavigate();
    const dataCard = [
        {heading:"Translations",value:"Add translations to use Customer Dashboard in any language.",content:"Manage Translations",link:"/components/setting/translations"},
        {heading:"Plan",value:"Basic-Free",content:"Upgrade Plan",link:"/components/billing/plan"},
    ]  
    const need = [
        {heading:"Need Help",value:"",content:"Go To Support"},
    ]    
    const options = [
        {label: '21px', value: 'page-1'},
        {label: '22px', value: 'page-2'},
        {label: '23px', value: 'page-3'},
        {label: '24px', value: 'page-4'},
      ];
  return (
<>
<Page title='Setting'
 breadcrumbs={[{content: 'Products',onAction:()=>navigate(-1)}]}
 />
<Toggle/>
  <Page>
    <Layout>
        {
            dataCard.map((ele,index)=>(
                <Layout.AnnotatedSection
                title={ele.heading} key={index}>
                <Card sectioned>
                  <FormLayout>
                    {ele.value?<p>{ele.value}</p>:""}
                    <ButtonGroup>
                    {ele.link?<Link className='link' to={ele.link}><Button>{ele.content?ele.content:""}</Button></Link>:<Button>{ele.content?ele.content:""}</Button>}
                </ButtonGroup>
                  </FormLayout>
              
                </Card>
              </Layout.AnnotatedSection>
            ))
        }
    </Layout>
  </Page>
  <Page title='Typography And Color' primaryAction={{content:"Save"}}>
  <Layout>
    <Layout.Section oneHalf>
      <Card title="Sidebar">
        <Card.Section title="Font :">
        <FormLayout>
                <Select
                label="Menu Size"
                options={options}
                />
                  <Select
                label="Heading Size"
                options={options}
                />
                  <Select
                label="Font-Family"
                options={options}
                />
                </FormLayout>

        </Card.Section>
        <Card.Section>
      <ResourceList
        resourceName={{singular: 'product', plural: 'products'}}
        items={[
          {
            id: 0,
            name: 'Background',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 1,
            name: 'Border',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 2,
            name: 'Customer Name',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 3,
            name: 'Menu Background',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 4,
            name: 'Menu Text',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 5,
            name: 'Menu Active',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 6,
            name: 'Icon',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },
        ]}
        renderItem={(item) => {
          const {id, name, sku, media} = item;

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
                <Select
                label="Text Size"
                options={options}
                />
                  <Select
                label="Heading Size"
                options={options}
                />
                  <Select
                label="Font-Family"
                options={options}
                />
                </FormLayout>

        </Card.Section>
        <Card.Section>
      <ResourceList
        resourceName={{singular: 'product', plural: 'products'}}
        items={[
          {
            id: 0,
            name: 'Primary',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 1,
            name: 'Background',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 2,
            name: 'Foreground',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 3,
            name: 'Cards  Background',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 4,
            name: 'Card Text',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 5,
            name: 'Border',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 6,
            name: 'Text',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 7,
            name: 'Heading',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 8,
            name: 'Reorder',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },{
            id: 9,
            name: 'Reorder Text',
            sku: '#3D4246',
            media: (
           <PopoverSetting/>
            ),
          },
        ]}
        renderItem={(item) => {
          const {id, name, sku, media} = item;

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
    />
        </Card.Section>
    </Card>
  </Page>
  <Page>
    <Layout>
        {
            need.map((ele,index)=>(
                <Layout.AnnotatedSection
                title={ele.heading} key={index}>
                <Card sectioned>
                  <FormLayout>
                    {ele.value?<p>{ele.value}</p>:""}
                    <ButtonGroup>
                <Button>{ele.content?ele.content:""}</Button>
                </ButtonGroup>
                  </FormLayout>
              
                </Card>
              </Layout.AnnotatedSection>
            ))
        }
    </Layout>
  </Page>
  </>
  )
}

export default Setting