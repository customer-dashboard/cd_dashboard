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
  const [activeConfirm, setActiveConfirm] = useState(true);
  const [editConfirm, setEditConfirm] = useState(true);
  const [state, setState] = useState(value&&value)
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  useEffect(() => {
    setState(value)
    if(activeConfirm===false){
      setActive(<Toast content="Field Deleted" onDismiss={toggleActive} />);
      setActiveConfirm(true);
    }
    if(editConfirm===false){
    setActive(<Toast content="Field Updated" onDismiss={toggleActive} />);
    setEditConfirm(true);
    }
    }, [value])


  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...state];
      const item = data.splice(fromIndex, 1)[0];
      if(toIndex===0||toIndex===1||toIndex===2||fromIndex===0||fromIndex===1||fromIndex===2)data.splice(fromIndex, 0, item);
      else{
      data.splice(toIndex, 0, item);
      if (status === 'default' || status === 'menu_default') {
        setState(data)
        fetch(`/api/post-reorder-fields?query=${table}`, {
        method: 'POST',
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
    setActive(<Toast content="Reorder Saved" onDismiss={toggleActive} />)
    }
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
              <li key={index}><p><Icon source={DragHandleMinor} color={item.name==="first_name"||item.name==="last_name"||item.name==="email"?"subdued":""} /></p>
                <p className='content'>{item.label}</p>
                {status === 'menu_default' ? <p>
                  {defaultsvg.map((svg_element,index) => {
                    if (svg_element.id === parseInt(item.svg)) {
                    return <div className='cd_svg_icon' key={index}>{parse(svg_element.svg)}</div>
                    }
                  })}
                </p> : null}
                <div style={{width: "90px",position: "absolute",right: "20px"}}>
                  <p>{item.type === 'additional' ? <DeleteMenu value={value} id={item.id} getProfileData={result} table={table} type="Shared" activeConfirm={setActiveConfirm}/> : ""}</p>
                  <p>{item.type === 'additional' ? <EditFields value={value} id={index} getProfileData={result} table={table} activeConfirm={setEditConfirm}/> : ""}</p>
                  <p>{item.type && item.type === 'link' ? <span style={{ width: "20px", float: "right", marginLeft: "10px", cursor: "pointer" }}><Tooltip content="Link"><Icon source={LinkMinor} /></Tooltip></span> : ""}</p>
                  <p>{item.type && item.type === 'page' ? <span style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}><Tooltip content="Page"><Icon source={PageMajor} /></Tooltip></span> : ""} </p>
                  <p>{item.type && item.type === 'additional' ? <span style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}><Tooltip content="Additional field"><Icon source={PageMajor} /></Tooltip></span> : ""} </p>
                  <p>{item.type === 'link' || item.type === 'page' && item.type ? <DeleteMenu value={value} id={item.id} getProfileData={result} table={table} type="Navigation" activeConfirm={setActiveConfirm}/> : ""}</p>
                  <p>{item.type === 'link' || item.type === 'page' && item.type ? <EditMenu value={value} id={index} getProfileData={result} table={table} activeConfirm={setEditConfirm}/>:""}</p>
                </div>
              </li>
            ))}
          </ol>
        </ReactDragListView>
      </div>
      {active}
    </div>
  );
}
