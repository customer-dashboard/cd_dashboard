import ReactDragListView from 'react-drag-listview/lib/index.js';
import { DragHandleMinor } from "@shopify/polaris-icons";
import { DeleteComponent } from "../DeleteComponent";
import { EditFields } from "./EditFields";
import { DeleteMenu } from "../menu-builder/DeleteMenu";
import { EditMenu } from "../menu-builder/EditMenu";
import { LinkMinor, PageMajor } from "@shopify/polaris-icons";
import { Icon, Tooltip } from "@shopify/polaris";
import './index.css';
import { useEffect, useState } from 'react';
import axios from 'axios'; 

export const ProfileReorder = ({value,result,table,status})=> {
  const data = value;
  const [state, setState] = useState(data)
  setTimeout(function() {
  setState(data);
},100);

    const dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const data = [...state];
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        if(status==='default'){
          axios.post(`/api/post-reorder-fields?shop=${Shop_name}&query=${table}`,data).then(() => {
            result();
          });
        }
        if(status==='additional'){
          axios.post(`/api/put-profile-additional-fields?shop=${Shop_name}`,data).then(() => {
            result();
          });
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
              <li key={index}><p><Icon source={DragHandleMinor}/></p><p className='content'>{item.title}</p>
              <div style={{width:"25%"}}>
              <p>{status==='additional'?<DeleteComponent data={result} table="profile_additional_fields" id ={item.key}/>:""}</p>                     
              <p>{status==='additional'?<EditFields getAdditionalData={result} table="profile_additional_fields" id ={item.key} />:""}</p> 
              <p>{item.type&&item.type==='link'?<span style={{width:"20px", float:"right", marginLeft:"10px", cursor:"pointer"}}><Tooltip content="Link"><Icon source={LinkMinor}/></Tooltip></span>:""}</p>
              <p>{item.type&&item.type==='page'?<span style={{float:"right", marginLeft:"10px", cursor:"pointer"}}><Tooltip content="Page"><Icon source={PageMajor}/></Tooltip></span>:""} </p>                    
              <p>{item.type&&item.type==='page'?<DeleteMenu value={data} id={item.id} getProfileData={result}/>:item.type&&item.type==='link'?<DeleteMenu value={data} id={item.id} getProfileData={result}/>:""}</p>                     
              <p>{item.type&&item.type==='page'?<EditMenu value={data} id={index} getProfileData={result}/>:item.type&&item.type==='link'?<EditMenu value={data} id={index} getProfileData={result}/>:""}</p>     
              </div>
            </li>
            ))}
            </ol>
          </ReactDragListView>
        </div>
      </div>
    );
}
