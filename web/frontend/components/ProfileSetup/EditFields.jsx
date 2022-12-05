import { Button, ButtonGroup, FormLayout,Icon, Modal, Select, Spinner, TextField,} from '@shopify/polaris'
import {
  MinusMinor, PlusMinor, ThemeEditMajor
} from '@shopify/polaris-icons';
import { useAuthenticatedFetch } from "../../hooks";
import { useCallback, useEffect, useState } from 'react'
export default function EditFields(props) {
  const { value, id, getProfileData, table, activeConfirm} = props;
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");
  const [local, setLocal] = useState([]);
  const fetch = useAuthenticatedFetch();
  const [group, setGroup] = useState([{}])
  const [state, setState] = useState({
    label: "",
    value: "",
    name: "",
    type: "additional",
    multipleValue: []
  })

  const getField = async () => {
    const response = await fetch("/api/get-profile-fields");
    const content = await response.json();
    if (content.status === 200) {
      const res = JSON.parse(content.data[0].value);
      setState(res[id]);
      setCurrentLabel(res[id]?.label);
      if (res[id].multipleValue.length > 0) setGroup(res[id].multipleValue);
    }
  }
  const handleChange = useCallback(() => { getField(); setActive(!active), [active] });
  const activator = <span style={{ width: "15px", float: "right", cursor: "pointer", margin: "0px 10px 0" }} onClick={handleChange}> <ThemeEditMajor /></span>;
  const handleChange2 = (name, value) => {
    setState((preValue) => {
      return { ...preValue, [name]: value, }
    });
  }
  const options = [
    { label: 'Input', value: 'text' },
    { label: 'Date', value: 'date' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Radio-Button', value: 'radio' },
    { label: 'Checkbox', value: 'checkbox' },
  ];

  const groupChangval = (i, name, value) => {
    const newFormValues = [...group];
    newFormValues[i][name] = value;
    setGroup(newFormValues);
  }

  let addGroupField = () => {
    setGroup([...group, { value: "" }])
  }

  let removeGroupField = (i) => {
    if (i > 0) {
      let newFormValues = [...group];
      newFormValues.splice(i, 1);
      setGroup(newFormValues)
    }
  }

  useEffect(() => {
    GetLocal();
  }, [])


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
    if (content.status === 200) {
      setLocal(content.data.body.data.shopLocales);
    }
  }

  const Submit = () => {
    state.multipleValue = group;
    const data = value.map((ele, index) => {
      return index !== id ? ele : state;
    })
    setLoading(true);
    local.forEach(async (element_2) => {
      const res = await fetch(`/api/get-json?locale=${element_2.locale}`);
      const content = await res.json();
      if (content.status === 200&&content.data[0]?.value) {
        var arr = JSON.parse(content.data[0].value)[element_2.locale];
        const temp = arr.filter(obj1 => data.some(obj2 => obj2.label === obj1.heading && obj1.name === "Shared"))
        if(currentLabel!==state.label)temp.push({ heading: state.label, value: state.label, name: "Shared" });
        for (var i = arr.length - 1; i >= 0; i--) {
          if (arr[i].name === "Shared") {
            arr.splice(i, 1);
          }
        }
        temp.forEach(element => {
          arr.push(element);
        });
        const data_local = {
          value: { [element_2.locale]: arr },
          locale: element_2.locale
        }
        await fetch('/api/create-translations', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data_local)
        });
        const data_retrun = await fetch(`/api/post-reorder-fields?query=${table}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const content_return = await data_retrun.json();
        if (content_return.status === 200) {
          getProfileData();
          handleChange();
          setLoading(false);
          activeConfirm(false);
        }
      }
    });
  }




  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title="Edit Field"
    >
      <Modal.Section>
        <FormLayout>
          <FormLayout.Group condensed>
            <Select
              label="Select field type"
              placeholder="Select Type"
              options={options}
              onChange={(val) => handleChange2("value", val)}
              value={state.value}
              name="value"
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField
              value={state.label}
              onChange={(val) => handleChange2("label", val)}
              label="Field label"
              name="label"
              type="text" />
          </FormLayout.Group>
        </FormLayout>
        {group.map((element, index) => (
          <div key={index}>
            {state && state.value == 'radio' || state.value == 'checkbox' ?
              <TextField
                value={element.value}
                onChange={(val) => groupChangval(index, "value", val)}
                label={`Value-${index + 1}`}
                name="value"
                type="text"
                connectedRight={<ButtonGroup><Button onClick={() => removeGroupField(index)}><Icon source={MinusMinor} /></Button><Button onClick={() => addGroupField()}><Icon source={PlusMinor} color="base" /></Button></ButtonGroup>}
              />
              : null}
          </div>
        ))}
        <br />
        <ButtonGroup><Button primary loading={loading ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : null} onClick={Submit}>Update</Button></ButtonGroup>
      </Modal.Section>
    </Modal>
  )
}
