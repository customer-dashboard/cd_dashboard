import { Button, FormLayout, Modal, Select, TextContainer, TextField, RadioButton, Grid, Card, TextStyle, Spinner } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react';
import { useAuthenticatedFetch } from "../../hooks";
import Parser from 'html-react-parser';
export default function CustomePageModel(props) {
  const {defaultProfile,getProfileData, activeConfirm} = props;
  const id = defaultProfile.length;
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetch = useAuthenticatedFetch();
  const [local, setLocal] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [pages, setPages] = useState([]);
  const [defaultsvg, setdefaultsvg] = useState([]);
  const [state, setState] = useState({
    id: id,
    label: "",
    value: "",
    type: 'page',
    svg: ""
  })

  const handleChange = useCallback(() => { Clear(); setActive(!active), [active] });

  const activator = <Button onClick={handleChange}>Add Shopify Page</Button>;

  useEffect(() => {
    GetTranslations();
    GetLocal();
    getSvgIcon();
  }, [])


  const getSvgIcon = async () => {
    const res = await fetch(`/api/get-svg`);
    const content = await res.json();
    if (content.status === 200) setdefaultsvg(JSON.parse(content.data[0].value));
  }


  function add(arr, name) {
    const found = arr.some(el => el.heading === name);
    if (!found) arr.push({ heading: name, value: name, name: "Navigation" });
    return arr;
  }

  const Submit = () => {
    defaultProfile.push(state);
    setLoading(true);
    local.forEach(async (element_2) => {
      const res = await fetch(`/api/get-json?locale=${element_2.locale}`);
      const content = await res.json();
      if (content.status === 200) {
        var arr = JSON.parse(content.data[0].value)[element_2.locale];
        var array = [];
        defaultProfile.forEach(element => {
          array = add(arr, element.label);
        });
        const data = {
          value: { [element_2.locale]: array },
          locale: element_2.locale
        }
        const createTranslations = await fetch('/api/create-translations', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const respoonse = await createTranslations.json();
        if (respoonse.status === 200) {
          const data_retrun = await fetch(`/api/post-reorder-fields?query=menu_builder_fields`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultProfile)
          });
          const content_return = await data_retrun.json();
          if (content_return.status === 200) {
            getProfileData();
            handleChange();
            setLoading(false);
            activeConfirm(false);
          }
        }
      }
    });

  }

  const Clear = () => {
    setState({
      id: id,
      label: "",
      value: "",
      type: 'page',
      svg: ""
    });
  }

  const ChangeHendle = (value, name) => {
    setState((preValue) => {
      if (value) setToggle(false);
      else setToggle(true);
      return {
        ...preValue,
        [name]: value
      }
    })
  }
  const loop = [{ label: "Select Page", value: "" }];
  pages.map((ele) => (loop.push({ label: ele.handle, value: ele.handle })));

  const GetLocal = async () => {
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
    if (content.status === 200)
      setLocal(content.data.body.data.shopLocales);
  }


  const GetTranslations = async () => {
    const res = await fetch(`/api/get-pages`);
    const content = await res.json();
    if (content.status === 200) {
      setPages(content.data);
    }
  }

  return (
    <div>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Add Shopify Page"
        primaryAction={{
          content: 'Add',
          loading: loading ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : null,
          onAction: Submit,
          disabled: toggle ? true : false,
        }}
      >
        <Modal.Section>
          <TextContainer>
            <FormLayout>
              <TextField
                label="Page Label"
                name="label"
                value={state.label}
                onChange={(value) => ChangeHendle(value, 'label')}
                autoComplete="off" />
              <Select
                label="Select Page"
                options={loop}
                name="value"
                value={state.value}
                allowMultiple
                onChange={(value) => ChangeHendle(value, 'value')}
              />
              <TextStyle>Select Svg Icon</TextStyle>
              <Grid>
                {
                  defaultsvg.map((ele, index) =>
                    <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 2, xl: 2 }}>
                      <Card>
                        <div style={{ padding: "10px" }}>
                          <RadioButton
                            label={Parser(ele.svg)}
                            name="svg"
                            value={state.svg}
                            onChange={() => ChangeHendle(ele.id, 'svg')}
                          />
                        </div>
                      </Card>
                    </Grid.Cell>
                  )
                }
              </Grid>
            </FormLayout>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  )
}
