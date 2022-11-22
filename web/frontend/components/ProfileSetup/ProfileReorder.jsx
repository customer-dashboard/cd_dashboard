import ReactDragListView from 'react-drag-listview/lib/index.js';
import parse from 'html-react-parser';
import { DragHandleMinor } from "@shopify/polaris-icons";
import EditFields from "./EditFields";
import  DeleteMenu from "../menu-builder/DeleteMenu";
import  EditMenu from "../menu-builder/EditMenu";
import { LinkMinor, PageMajor } from "@shopify/polaris-icons";
import { Icon, Tooltip, Toast } from "@shopify/polaris";
import './index.css';
import { useCallback, useEffect, useState } from 'react';
import { useAuthenticatedFetch } from "../../hooks";

export default function ProfileReorder(props){
  const { value, result, table, status, defaultsvg} = props;
  const fetch = useAuthenticatedFetch();
  const [state, setState] = useState(value&&value)
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content="Reorder Saved" onDismiss={toggleActive} />
  ) : null;

  useEffect(() => {
    setState(value)
    }, [value])


  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...state];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      if (status === 'default' || status === 'menu_default') {
        setState(data)
        fetch(`/api/post-reorder-fields?query=${table}`, {
        method: 'POST',
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      setActive(true);
    }
    },
    nodeSelector: 'li',
    handleSelector: 'span'
  };

  return (
    <div className="simple simple1">
      <div className="simple-inner">
        <ReactDragListView {...dragProps}>
          <ol>
            {state.map((item, index) => (
              <li key={index}><p><Icon source={DragHandleMinor} /></p>
                <p className='content'>{item.label}</p>
                {status === 'menu_default' ? <p>
                  {defaultsvg.map((svg_element,index) => {
                    if (svg_element.id === parseInt(item.svg)) {
                    return <div className='cd_svg_icon' key={index}>{parse(svg_element.svg)}</div>
                    }
                  })}
                </p> : null}
                <div style={{width: "90px",position: "absolute",right: "20px"}}>
                  <p>{item.type === 'additional' ? <DeleteMenu value={value} id={item.id} getProfileData={result} table={table} type="Shared" /> : ""}</p>
                  <p>{item.type === 'additional' ? <EditFields value={value} id={index} getProfileData={result} table={table} /> : ""}</p>
                  <p>{item.type && item.type === 'link' ? <span style={{ width: "20px", float: "right", marginLeft: "10px", cursor: "pointer" }}><Tooltip content="Link"><Icon source={LinkMinor} /></Tooltip></span> : ""}</p>
                  <p>{item.type && item.type === 'page' ? <span style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}><Tooltip content="Page"><Icon source={PageMajor} /></Tooltip></span> : ""} </p>
                  <p>{item.type && item.type === 'additional' ? <span style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}><Tooltip content="Additional field"><Icon source={PageMajor} /></Tooltip></span> : ""} </p>
                  <p>{item.type === 'link' || item.type === 'page' && item.type ? <DeleteMenu value={value} id={item.id} getProfileData={result} table={table} type="Navigation" /> : ""}</p>
                  <p>{item.type === 'link' || item.type === 'page' && item.type ? <EditMenu value={value} id={index} getProfileData={result} table={table} />:""}</p>
                </div>
              </li>
            ))}
          </ol>
        </ReactDragListView>
      </div>
      {toastMarkup}
    </div>
  );
}
